// server/index.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');
const {
  activeRooms,
  addLobby,
  removeLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  getPlayersInLobby,
  socketToLobbyMap,
  setPlayerVotes,
  getLobbyVotes,
  checkAllVoted,
  convertToRestaurantInfo
} = require('./lib/rooms.js');
// const { default: restaurants } = require('./components/restaurantTestData.jsx');
const {make_request} = require('./lib/yelp_request.js')



const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinLobby', ({ lobbyId, name }) => {
      socket.join(lobbyId);
      console.log(`User ${name} joined lobby: ${lobbyId}`);

      addPlayerToLobby(lobbyId, { id: socket.id, host: false, name });
      console.log('stopped')
      io.to(lobbyId).emit('lobbyPlayerList', getPlayersInLobby(lobbyId));
      console.log("lobby: ", lobbyId, " players ", getPlayersInLobby(lobbyId))
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      const lobbyId = socketToLobbyMap[socket.id];
      if (lobbyId) {
        const removedPlayer = removePlayerFromLobby(lobbyId, socket.id);

        if (removedPlayer) {
          // Notify the lobby that a player has left
          io.to(lobbyId).emit('lobbyPlayerList', getPlayersInLobby(lobbyId));
        }
      }
      
    });

    //when the host clicks 'start game' on the lobby 
    socket.on('startGame', (lobbyId) => {
      console.log(`Starting game with lobby id: ${lobbyId}`)

      const emitRestaurantCards = async (requestObj) => {
        try {
            // Make the request to Yelp API
            const yelpData = await make_request(requestObj);
    
            // Check if there was an error
            if (yelpData.error) {
                console.error('Error fetching Yelp data:', yelpData.error);
                return;
            }
    
            // Convert the Yelp data to the required format
            const restaurantInfo = yelpData.businesses.map(business => convertToRestaurantInfo(business));
    
            // Emit the restaurant cards to the lobby
            io.to(lobbyId).emit('restauraunt_cards', { restaurants: restaurantInfo });
    
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    }

    // {
    //   longitude: -83.743,
    //   latitude: 42.2808,
    //   numRestaurants: 5,
    //   radius: 5,
    //   minRating: 3.5
    // }
    const settings = activeRooms[lobbyId].settings
    emitRestaurantCards({ longitude: settings.longitude, latitude : settings.latitude, sort_by: 'best_match', limit: settings.numRestaurants, radius: 5000 });
      console.log(activeRooms[lobbyId].settings)
      // io.to(lobbyId).emit('restauraunt_cards',{restaurants: [convertToRestaurantInfo(testYelpData)]})
    })
    
    //listening for submitVotes
    socket.on('submitVotes', ({ lobbyId, playerId, votes }) => {
      //if this socket catches something on submitVotes, we'll see which lobby it was for, and the player and the votes
      console.log(`Recieved votes from the lobby ${lobbyId} and the player ${playerId}:`, votes)

      //this will set the specific player's votes in the lobbyObject
      //lobbyObject : Player List, Settings, Votes, List of Restaurantants
      //this setPlayerVotes function takes the specific lobby and the playerId
      //with these things, in the votes object for the lobby, will make an entry for a player and their votes
      setPlayerVotes(lobbyId, playerId, votes)

      socket.emit('votesReceived', { status: 'success', message: 'Votes received and stored' });


      //if everyone has voted in the lobby
      if (checkAllVoted(lobbyId)) {
        //get the votes 
        const lobbyVotes = getLobbyVotes[lobbyId]
        console.log(`All players in the lobby ${lobbyId} have voted`, lobbyVotes)

        //redirect everyone in that have joined a specific room: io.join(lobbyId)
        //will emit a message for the client with the lobbyVotes for this lobby to them
        io.to(lobbyId).emit('gotAllVotes', lobbyVotes)
      }

    })

  });


  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${process.env.NEXT_PUBLIC_NEXT_DOMAIN}`);
  });
});


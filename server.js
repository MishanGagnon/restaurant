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

      //REQUEST YELP -- TODO
      testYelpData = {
        "id": "qh8SGt-7jd-JTXCxe7Amlg",
        "alias": "peridot-ann-arbor",
        "name": "Peridot",
        "image_url": "https://s3-media2.fl.yelpcdn.com/bphoto/iA1PwGvQDUDqA6aLG4npsg/o.jpg",
        "is_closed": false,
        "url": "https://www.yelp.com/biz/peridot-ann-arbor?adjust_creative=cdiqpTSshvT5qy3mi2VlcQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=cdiqpTSshvT5qy3mi2VlcQ",
        "review_count": 48,
        "categories": [
          {
            "alias": "vietnamese",
            "title": "Vietnamese"
          },
          {
            "alias": "cocktailbars",
            "title": "Cocktail Bars"
          },
          {
            "alias": "wine_bars",
            "title": "Wine Bars"
          }
        ],
        "rating": 4.3,
        "coordinates": {
          "latitude": 42.27982,
          "longitude": -83.74951
        },
        "transactions": [],
        "location": {
          "address1": "118 W Liberty St",
          "address2": "",
          "address3": null,
          "city": "Ann Arbor",
          "zip_code": "48104",
          "country": "US",
          "state": "MI",
          "display_address": [
            "118 W Liberty St",
            "Ann Arbor, MI 48104"
          ]
        },
        "phone": "+17347733097",
        "display_phone": "(734) 773-3097",
        "distance": 1432.8391549187136,
        "business_hours": [
          {
            "open": [
              {
                "is_overnight": false,
                "start": "1700",
                "end": "0000",
                "day": 0
              },
              {
                "is_overnight": false,
                "start": "1700",
                "end": "0000",
                "day": 1
              },
              {
                "is_overnight": false,
                "start": "1700",
                "end": "0000",
                "day": 2
              },
              {
                "is_overnight": false,
                "start": "1700",
                "end": "0000",
                "day": 3
              },
              {
                "is_overnight": true,
                "start": "1700",
                "end": "0100",
                "day": 4
              },
              {
                "is_overnight": true,
                "start": "1700",
                "end": "0100",
                "day": 5
              }
            ],
            "hours_type": "REGULAR",
            "is_open_now": true
          }
        ],
        "attributes": {
          "business_temp_closed": null,
          "menu_url": "https://www.peridota2.com/menus",
          "open24_hours": null,
          "waitlist_reservation": null
        }
      }
      io.to(lobbyId).emit('restauraunt_cards',{restaurants: [convertToRestaurantInfo(testYelpData)]})
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
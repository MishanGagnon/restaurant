const { Client } = require('@googlemaps/google-maps-services-js');

// server/index.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');
const fs = require('fs');

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
  convertToRestaurantInfo,
  getLobby,
  getTotalVotes,
  getSortedRestaurantInfo,
  didPlayerVote,
} = require('./lib/rooms.js');
const { make_request } = require('./lib/yelp_request.js')

//host request functions
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => degrees * (Math.PI / 180); // Convert degrees to radians

  const R = 3958.8; // Radius of the Earth in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in miles
}

async function getNearbyRestaurants(lat, lon, radius, price, numRestaurants) {
  try {
    // Fetch nearby places
    const client = new Client({});

    const response = await client.placesNearby({
      params: {
        location: { lat, lng: lon }, // Dynamic coordinates
        radius, // Search radius in meters
        type: 'restaurant', // Search for restaurants
        key: process.env.NEXT_GOOGLE_API_KEY, // Replace with your API key
        maxprice: price, // Max price level
      },
      timeout: 1000, // Optional timeout in milliseconds
    });

    const places = response.data.results;
    if (places.length === 0) {
      console.log('No places found.');
      return [];
    }

    // Map places into a cleaned-up `restaurants` array
    const restaurants = places.map((place) => ({
      name: place.name, // string
      rating: place.rating, // double
      photoReference: place.photos?.[0]?.photo_reference || null, // long string (handle undefined)
      price: place.price_level, // int
      address: place.vicinity, // address
      reviewCount: place.user_ratings_total,
      distance: haversineDistance(lat,lon,place.geometry.location.lat,place.geometry.location.lng),
      restaurant_id: place.place_id
    }));

    // Fetch photos for the first 5 restaurants
    const photoPromises = restaurants.slice(0, numRestaurants).map((place) => {
      if (!place.photoReference) {
        return Promise.resolve({ ...place, photoURL: 'none' }); // Return 'none' if no photo reference
      }

      return client
        .placePhoto({
          params: {
            photoreference: place.photoReference,
            maxwidth: 1200, // Define the desired image width
            key: process.env.NEXT_GOOGLE_API_KEY, // Replace with your API key
          },
          timeout: 1000, // Optional timeout in milliseconds
        })
        .then((photoResponse) => {
          return { ...place, image_url: photoResponse.request.res.responseUrl }; // Add photo URL
        })
        .catch((error) => {
          console.error('Error fetching photo:', error);
          return { ...place, image_url: 'none' }; // Handle photo fetch error
        });
    });

    // Wait for all photo fetches to complete
    const updatedRestaurants = await Promise.all(photoPromises);

    return updatedRestaurants; // Return the enriched restaurants array
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}


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
    const { userID } = socket.handshake.query;
    console.log('A user connected:', userID);

    socket.on('joinLobby', ({ lobbyId, name }) => {
      socket.join(lobbyId);
      console.log(`User ${name} joined lobby: ${lobbyId}`);

      addPlayerToLobby(lobbyId, { id: userID, host: false, name });
      io.to(lobbyId).emit('lobbyPlayerList', getPlayersInLobby(lobbyId));
      //if users alreading voting send data
      const lobby = activeRooms[lobbyId]
      console.log(userID)
      
      if(lobby.gameState === 'voting'){
        io.to(socket.id).emit('restauraunt_cards', { restaurants: lobby.restaurantInfo, playerVoted : didPlayerVote });
      }else if (lobby.gameState === 'endscreen') {
        io.to(socket.id).emit('gotAllVotes', lobby.results)
      }else{
        io.to(socket.id).emit('gameState',  lobby.gameState );
      }
      
      // io.to(socket.id).emit('gameState',lobby.gameState)


      // console.log("lobby: ", lobbyId, " players ", getPlayersInLobby(lobbyId))


      //this works but there are unintended bugs if a user votes then reloads, we should likely use localStorage
      //as a quick way to figure out if a user is the same one who just left

      
      // if (lobby.gameState === 'voting')
      //    { io.to(userID).emit('restauraunt_cards', { restaurants: lobby.restaurantInfo }); }

    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', userID);

      const lobbyId = socketToLobbyMap[userID];
      if (lobbyId) {
        const removedPlayer = removePlayerFromLobby(lobbyId, userID);

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
          
          // Convert the Yelp data to the required format
          const restaurantInfo = await getNearbyRestaurants(requestObj.latitude,requestObj.longitude,requestObj.radius,requestObj.price,requestObj.limit)
          console.log(restaurantInfo)
          // Emit the restaurant cards to the lobby
          const lobby = activeRooms[lobbyId]
          lobby.restaurantInfo = restaurantInfo
          lobby.gameState = 'voting'
          io.to(lobbyId).emit('restauraunt_cards', { restaurants: restaurantInfo, playerVoted : false });

        } catch (error) {
          console.error('Unexpected error:', error);
        }
      }

      // {
      //   longitude: -83.743,
      //   latitude: 42.2808,
      //   numRestaurants: 5,
      //   radius: 5,
      //   price: 3.5
      // }

      const settings = activeRooms[lobbyId].settings
      const metersFromMiles = Math.round(settings.radius * 1609.344)

      emitRestaurantCards({ longitude: settings.longitude, latitude: settings.latitude, limit: settings.numRestaurants, radius: metersFromMiles, price : settings.price });
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

      const lobby = getLobby(lobbyId);
      console.log(`This is the lobby after clicking the submit button and voting`, lobby)
      const num_players = lobby.players.length;
      const num_voted = Object.keys(lobby.votes).length
      io.to(lobbyId).emit('votesData', { success: true, num_voted, num_players });

      //if everyone has voted in the lobby
      if (checkAllVoted(lobbyId)) {
        //get the votes 
        //Votes object: Array of player ids: { map of restaurant id: 0 || 1}
        const lobbyVotes = getLobbyVotes(lobbyId)
        console.log(`All players in the lobby ${lobbyId} have voted. Here are the votes`, lobbyVotes)
        
        const sortedVotes = getTotalVotes(lobbyVotes)
        console.log(`Here are the sortedVotes`, sortedVotes)
        // console.log(`Here are the top 3 restaurants`, topThree)

        const lobby = getLobby(lobbyId);
        if (!lobby || !lobby.restaurantInfo) {
          console.error('Restaurant info not found for lobby:', lobbyId);
          return;
        }

        const SortedRestaurantInfo = getSortedRestaurantInfo(lobby.restaurantInfo, sortedVotes)
        //console.log(`All RestuarantInfo objects`, SortedRestaurantInfo);

        //redirect everyone in that have joined a specific room: io.join(lobbyId)
        //will emit a message for the client with the lobbyVotes for this lobby to them
        //lobby.gameState = 'endscreen'
        lobby.results = { sortedVotes, SortedRestaurantInfo }
        io.to(lobbyId).emit('gotAllVotes', lobby.results)

        lobby.gameState = 'endscreen'
      }
    })

  });


  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${process.env.NEXT_PUBLIC_NEXT_DOMAIN}`);
  });
});


// let activeRooms = {};
// let socketToLobbyMap = {};

// const { default: restaurants } = require("@/components/restaurantTestData");

//THIS CODE PREVENTS STUPID REINITIALIZATION ON IMPORT 
//DO NOT DELETE THIS CODE

let activeRooms;
let socketToLobbyMap;


if (!global.activeRooms) {
  global.activeRooms = {
    "TEST":
    {
      players: [],
      votes: {},
      settings: {
        longitude: -83.743,
        latitude: 42.2808,
        numRestaurants: 5,
        radius: 5,
        price: 2
      },
      gameState: 'lobby'
    }
  };
}
if (!global.socketToLobbyMap) {
  global.socketToLobbyMap = {};
}
socketToLobbyMap = global.socketToLobbyMap;
activeRooms = global.activeRooms;


function convertToRestaurantInfo(data) {
  // Helper function to format the categories
  function formatCategories(categories) {
    return categories.map(category => category.title);
  }

  // Helper function to get closing times
  function getClosingTimes(businessHours) {
    if (!businessHours || businessHours.length === 0) return [];
    return businessHours[0].open.map(hours => {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = dayNames[hours.day];
      const endTime = hours.is_overnight ? `Next day ${hours.end}` : hours.end;
      return `${day}: Closes at ${endTime}`;
    });
  }

  // Constructing the RestaurantInfo object
  const restaurantInfo = {
    restaurant_id: data.id,
    name: data.name,
    address: data.location.display_address.join(', '),
    reviewCount: data.review_count,
    image_url: data.image_url,
    rating: data.rating,
    categories: formatCategories(data.categories),
    price: null, // Assuming price information is not available in the provided data
    distance: data.distance,
    location: `${data.coordinates.latitude},${data.coordinates.longitude}`,
    closing_times: getClosingTimes(data.business_hours)
  };

  return restaurantInfo;
}

function addLobby({ lobbyId, settings }) {
  console.log('adding new lobby')
  if (!(lobbyId in activeRooms)) {
    activeRooms[lobbyId] = {
      players: [],
      votes: {},
      settings: settings,
      gameState: 'lobby',
      restaurantData: []

    };
    console.log('new lobby created', lobbyId);

    // Schedule lobby removal if no players join within 1 minute
    setTimeout(() => {
      if (activeRooms[lobbyId] && activeRooms[lobbyId].players.length === 0) {
        removeLobby(lobbyId);
        console.log(`Lobby ${lobbyId} removed due to inactivity`);
      }
    }, 1 * 60 * 1000);
  }
  console.log(activeRooms, 'current active rooms');
}

function removeLobby(lobbyId) {
  if (lobbyId in activeRooms) {
    delete activeRooms[lobbyId];
  }
}

function addPlayerToLobby(lobbyId, player) {

  const lobby = activeRooms[lobbyId];
  lobby.players.push(player);
  socketToLobbyMap[player.id] = lobbyId;

  //make player host if they are only player in lobby
  if (lobby.players.length == 1) {
    lobby.players[0].host = true
  }
  console.log(activeRooms)
  console.log(lobby.players)
}


function removePlayerFromLobby(lobbyId, playerId) {
  if (lobbyId in activeRooms) {
    const lobby = activeRooms[lobbyId];
    const index = lobby.players.findIndex(player => player.id === playerId);
    if (index !== -1) {
      //check if player is host and reassign
      const reassignHost = (lobby.players[index].host == true)

      const [removedPlayer] = lobby.players.splice(index, 1);
      delete socketToLobbyMap[playerId];
      if (lobby.players.length === 0) {
        removeLobby(lobbyId);
      }
      if (reassignHost) {
        lobby.players[0].host = true
      }

      return removedPlayer;
    }
  }
  return null;
}

function getPlayersInLobby(lobbyId) {
  if (lobbyId in activeRooms) {
    return activeRooms[lobbyId].players;
  }
  return [];
}

const getActiveRooms = () => {
  return activeRooms;
};

//setting the votes for that specific player
function setPlayerVotes(lobbyId, playerId, votes) {
  if (lobbyId in activeRooms) {
    //for a specific lobby, the votes object will store all players' votes depending on their playerId
    activeRooms[lobbyId].votes[playerId] = votes;
    // console.log(`Votes set for ${activeRooms[lobbyId].players[playerId]} in the lobby ${lobbyId}`)

    // // Each object in players list is like this Example: { id: 'zNKfp3_hIMNztcJUAAAE', host: false, name: 'asbdiagsd' }
    // // console.log("This is the player object structure", activeRooms[lobbyId].players[playerId].name);
    // console.log("These are the current votes for the lobby:", activeRooms[lobbyId].votes)

    // console.log(`Players: ${activeRooms[lobbyId].players.length}`);
    // console.log(`Votes: ${Object.keys(activeRooms[lobbyId].votes).length}`)
  }
  else {
    console.log(`Lobby with the code ${lobbyId} does not exist`)
  }
}

//for getting the votes for a specific lobby
function getLobbyVotes(lobbyId) {
  if (lobbyId in activeRooms) {
    return activeRooms[lobbyId].votes;
  } else {
    console.log(`Error getting lobby ${lobbyId}`);
    return {};
  }
}

function checkAllVoted(lobbyId) {
  if (lobbyId in activeRooms) {
    const num_players = activeRooms[lobbyId].players.length
    const num_votes = Object.keys(activeRooms[lobbyId].votes).length;
    if (num_players === num_votes) {
      console.log(`This worked, got all votes YAY`);
      return true;
    }
  }
  return false
}

function getLobby(lobbyId) {
  return activeRooms[lobbyId];
}

function getTotalVotes(lobbyVotes) {
  const totalVotes = {};
  Object.keys(lobbyVotes).forEach((playerid) => {
    const playerVotes = lobbyVotes[playerid];

    Object.keys(playerVotes).forEach((restaurantId) => {
      totalVotes[restaurantId] = totalVotes[restaurantId] 
      ? totalVotes[restaurantId] + playerVotes[restaurantId] 
      : playerVotes[restaurantId];
    })
  })

  const sortedVotes = Object.entries(totalVotes)
  .sort(([, a], [, b]) => b - a) 
  .reduce((acc, [key, value]) => {
    acc[key] = value; 
    return acc;
  }, {});

  // const topThree = Object.keys(sortedVotes)
  //   .slice(0, 3)
  //   .reduce((acc, key) => {
  //     acc[key] = sortedVotes[key];
  //     return acc;
  //   }, {});

  return sortedVotes;
}

function getSortedRestaurantInfo(restaurants, sortedVotes) {
  const restaurant_ids = Object.keys(sortedVotes);
  const all_restaurant_info = restaurant_ids.map(id => restaurants.find(restaurant => restaurant.restaurant_id === id))

  return all_restaurant_info;
}



module.exports = {
  convertToRestaurantInfo,
  socketToLobbyMap,
  activeRooms,
  addLobby,
  removeLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  getPlayersInLobby,
  getActiveRooms,
  setPlayerVotes,
  getLobbyVotes,
  checkAllVoted,
  getLobby,
  getTotalVotes,
  getSortedRestaurantInfo,
};

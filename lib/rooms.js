// let activeRooms = {};
// let socketToLobbyMap = {};

//THIS CODE PREVENTS STUPID REINITIALIZATION ON IMPORT 
//DO NOT DELETE THIS CODE

let activeRooms;
let socketToLobbyMap;

if (process.env.NODE_ENV === 'production') {
  activeRooms = {};
  socketToLobbyMap = {};
} else {
  if (!global.activeRooms) {
    global.activeRooms = {};
  }
  if (!global.socketToLobbyMap) {
    global.socketToLobbyMap = {};
  }
  socketToLobbyMap = global.socketToLobbyMap;
  activeRooms = global.activeRooms;
}

function addLobby(lobbyId) {
  if (!(lobbyId in activeRooms)) {
    activeRooms[lobbyId] = {
      players: [],
      votes: {}
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
    console.log(`Votes set for ${activeRooms[lobbyId].players[playerId]} in the lobby ${lobbyId}`)
  }
  else {
    console.log(`Lobby with the code ${lobbyId} is not found`)
  }
}

//for getting the votes for a specific lobby
function getLobbyVotes(lobbyId) {
  if (lobbyId in activeRooms) {
    return activeRooms[lobbyId].votes;
  } else {
    console.log(`Error etting lobby ${lobbyId}`);
    return {};
  }
}

function checkAllVoted(lobbyId){
  if(lobbyId in activeRooms){
    const lobby = activeRooms[lobbyId]
    const num_players = lobby.players.length
    const num_votes = lobby.votes.length
    if(num_players === num_votes) {
      console.log(`This worked, got all votes FUCK YEA`);
      return true;
    }
  }
  return false
}

module.exports = {
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
  checkAllVoted
};

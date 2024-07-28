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
    activeRooms[lobbyId] = { players: [] };
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
  if(lobby.players.length == 1){
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
      }else{
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

module.exports = {
  socketToLobbyMap,
  activeRooms,
  addLobby,
  removeLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  getPlayersInLobby,
  getActiveRooms,
};

// let activeRooms = {};
// let socketToLobbyMap = {};


//THIS CODE PREVENTS STUPID REINITIALIZATION ON IMPORT 
//DO NOT DELETE THIS CODE

let activeRooms;
let socketToLobbyMap;

if (process.env.NODE_ENV === 'production') {
  activeRooms = {};
  socketToLobbyMap = {}
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
  }
  console.log(activeRooms, 'current active rooms');
}

function removeLobby(lobbyId) {
  if (lobbyId in activeRooms) {
    delete activeRooms[lobbyId];
  }
}

function addPlayerToLobby(lobbyId, player) {
  // if (!(lobbyId in activeRooms)) {
  //   addLobby(lobbyId);
  // }
  const lobby = activeRooms[lobbyId];
  lobby.players.push(player);
  socketToLobbyMap[player.id] = lobbyId;
}

function removePlayerFromLobby(lobbyId, playerId) {
  if (lobbyId in activeRooms) {
    const lobby = activeRooms[lobbyId];
    const index = lobby.players.findIndex(player => player.id === playerId);
    if (index !== -1) {
      const [removedPlayer] = lobby.players.splice(index, 1);
      delete socketToLobbyMap[playerId];
      if (lobby.players.length === 0) {
        removeLobby(lobbyId);
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

// lib/rooms.js
const activeRooms = new Map();
const socketToLobbyMap = new Map();
console.log('Initializing activeRooms and socketToLobbyMap');


function addLobby(lobbyId) {
  if (!activeRooms.has(lobbyId)) {
    activeRooms.set(lobbyId, { players: [] });
  }
  console.log('new lobby created', lobbyId)
}

function removeLobby(lobbyId) {
  if (activeRooms.has(lobbyId)) {
    activeRooms.delete(lobbyId);
  }
}

function addPlayerToLobby(lobbyId, player) {
  if (!activeRooms.has(lobbyId)) {
    addLobby(lobbyId);
  }
  const lobby = activeRooms.get(lobbyId);
  lobby.players.push(player);
  socketToLobbyMap.set(player.id, lobbyId);
}

function removePlayerFromLobby(lobbyId, playerId) {
  if (activeRooms.has(lobbyId)) {
    const lobby = activeRooms.get(lobbyId);
    const index = lobby.players.findIndex(player => player.id === playerId);
    if (index !== -1) {
      const [removedPlayer] = lobby.players.splice(index, 1);
      socketToLobbyMap.delete(playerId);
      if (lobby.players.length === 0) {
        removeLobby(lobbyId);
      }
      return removedPlayer;
    }
  }
  return null;
}

function getPlayersInLobby(lobbyId) {
  if (activeRooms.has(lobbyId)) {
    return activeRooms.get(lobbyId).players;
  }
  return [];
}


module.exports = {
  activeRooms,
  addLobby,
  removeLobby,
  addPlayerToLobby,
  removePlayerFromLobby,
  getPlayersInLobby,
  
  socketToLobbyMap,
};

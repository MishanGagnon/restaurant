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
} = require('./lib/rooms.js');

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

      addPlayerToLobby(lobbyId, { id: socket.id, name });

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
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
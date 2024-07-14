const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketIo = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const activeRooms = new Map();
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinLobby', ({lobbyId,name}) => {
      // if (activeRooms.has(lobbyId)) {
        socket.join(lobbyId);
        console.log(`User joined lobby: ${lobbyId} - ${name}`);
        console.log(io.sockets.adapter.rooms.get(lobbyId));
      // } else {
      //   socket.emit('error', 'Lobby not active');
      //   console.log(`Attempted to join inactive lobby: ${lobbyId}`);
      // }
    });

    socket.on('vote', (data) => {
      const { lobbyId, vote } = data;
      io.to(lobbyId).emit('vote', vote);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});

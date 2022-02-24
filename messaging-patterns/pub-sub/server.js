const { createServer } = require('node:http');
const { Server } = require('socket.io');
const staticHandler = require('serve-handler');

const server = createServer(async (req, res) => {
  await staticHandler(req, res, { public: 'messaging-patterns/pub-sub/www' });
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on('chat message', (message) => {
    console.log(`Received: ${message}`);
    socket.broadcast.emit('chat message', {
      message,
      sender: socket.id,
    });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', {
      message: 'leaves the room',
      sender: socket.id,
    });
  });
});

server.listen(3000, () => console.log('Listening on port 3000...'));

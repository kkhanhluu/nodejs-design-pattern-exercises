const { createServer } = require('node:http');
const { Server } = require('socket.io');
const crypto = require('node:crypto');
const staticHandler = require('serve-handler');

const users = new Map();

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let body = [];
  req
    .on('data', (chunk) => body.push(chunk))
    .on('end', () => {
      body = Buffer.concat(body).toString();
      console.log(req.method, url.pathname);
      if (url.pathname === '/signup' && req.method === 'POST') {
        const name = body.substr(body.indexOf('=') + 1);
        const id = crypto.randomBytes(16).toString('hex');
        users.set(id, { name });
        res.writeHead(301, {
          location: 'http://localhost:3000/chat',
          'Content-type': 'text/html',
          'Set-cookie': `id=${id}; Secure; HttpOnly`,
        });
        res.end();
      }
    });
  await staticHandler(req, res, { public: 'messaging-patterns/pub-sub/www' });
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);
  const cookie = socket.request.headers.cookie;
  const userId = cookie?.substring(cookie.indexOf('=') + 1);
  users.set(userId, {
    ...users.get(userId),
    online: true,
    color: getRandomColor(),
    socketId: socket.id,
  });
  socket.broadcast.emit('online', {
    userId,
    name: users.get(userId).name,
    online: true,
  });

  const initializeResult = [];
  users.forEach((u, id) => initializeResult.push({ ...u, id }));
  io.to(socket.id).emit('initialize', initializeResult);

  socket.on('chat message', (message) => {
    console.log(`Received: ${message}`);
    socket.broadcast.emit('chat message', {
      message,
      sender: users.get(userId).name,
    });
  });
  socket.on('disconnect', () => {
    users.set(userId, { ...users.get(userId), online: false });
    socket.broadcast.emit('leave', {
      message: 'leaves the room',
      sender: users.get(userId).name,
      userId,
    });
  });
});

server.listen(3000, () => console.log('Listening on port 3000...'));

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

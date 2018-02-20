const socketIo = require('socket.io');
const redis = require('socket.io-redis');
const client = require('src/resources/redis');
const server = require('src/resources/server');

const io = socketIo(server, {
  path: '/notifications',
  serveClient: false,
  transports: ['polling', 'websocket'],
});

const redisAdapter = redis({
  pubClient: client,
  subClient: client,
});

io.adapter(redisAdapter);

module.exports = io;

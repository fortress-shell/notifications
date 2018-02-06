const socketIo = require('socket.io');
const redis = require('socket.io-redis');
const client = require('src/resources/redis');

io.adapter(redis(client));

const io = socketIo(3000, {
  path: '/notifications',
  serveClient: false,
  transports: ['polling', 'websocket'],
});

module.exports = io;

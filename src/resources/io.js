const redis = require('socket.io-redis');
const client = require('src/resources/redis');
const config = require('src/config');
const io = require('socket.io')({
  path: config.get('socket.io:path'),
});
io.adapter(redis(client));

module.exports = io;

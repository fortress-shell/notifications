const config = require('src/config');
const http = require('http');
const server = http.createServer();
const PORT = config.get('PORT');
const IP = config.get('IP');

server.listen(PORT, IP);

module.exports = server;

const config = require('src/config');
const http = require('http');
const PORT = config.get('PORT');
const IP = config.get('IP');
const server = http.createServer((req, res) => res.end('OK'));

server.listen(PORT, IP);

module.exports = server;

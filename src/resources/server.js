const config = require('src/config');
const http = require('http');
const PORT = config.get('ADDV_PORT');
const IP = config.get('ADDV_IP');
const server = http.createServer((req, res) => res.end('OK'));

server.listen(PORT, IP);

module.exports = server;

const http = require('http');
const server = http.createServer();
const config = require('src/config');
const logger = require('src/utils/logger');
const PORT = config.get('socket.io:port');
const IP = config.get('socket.io:ip');

logger.info(`Server will serve on ip ${IP} and port ${PORT}`);

module.exports = server.listen(PORT, IP);

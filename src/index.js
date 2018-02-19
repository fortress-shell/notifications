const io = require('src/resources/io');
const redis = require('src/resources/redis');
const server = require('src/resources/server');
const Logger = require('src/utils/logger');
const debug = require('debug');
const logger = require('src/utils/logger');
const ApplicationController = require('controllers/application-controller');
const notifications = new ApplicationController(io, redis);

logger.log('Applications started!');

io.use(notifications.onAuthentication);
io.on('connection', notifications.onConnection);

function onShutdown() {
  logger.log('Applications shutdown!');
}

for (const event of ['SIGINT', 'SIGTERM']) {

  process.once(event, onShutdown);
}

const io = require('src/resources/io');
const redis = require('src/resources/redis');
const server = require('src/resources/server');
const debug = require('debug');
const logger = require('src/utils/logger');
const NotificationsController = require('src/controllers');
const notifications = new NotificationsController(io, redis);

logger.log('Applications started!');

io.use(notifications.onAuthentication.bind(notifications));
io.on('connection', notifications.onConnection.bind(notifications));

function onShutdown() {
  logger.log('Applications shutdown!');
}

for (const event of ['SIGINT', 'SIGTERM']) {

  process.once(event, onShutdown);
}

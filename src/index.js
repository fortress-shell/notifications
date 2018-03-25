const io = require('src/resources/io');
const redis = require('src/resources/redis');
const db = require('src/resources/db');
const server = require('src/resources/server');
const logger = require('src/utils/logger');
const NotificationsController = require('src/controllers/notifications');
const config = require('src/config');
const SECRET_TOKEN = config.get('SECRET_TOKEN');
const notifications = new NotificationsController(db, SECRET_TOKEN);

logger.log('Applications started!');

io.use(notifications.onAuthentication.bind(notifications));
io.on('connection', notifications.onConnection.bind(notifications));

/**
 * Graceful shutdown handler
 */
function onShutdown() {
  logger.log('Applications shutdown!');
  server.close();
}

for (const event of ['SIGINT', 'SIGTERM']) {
  process.once(event, onShutdown);
}

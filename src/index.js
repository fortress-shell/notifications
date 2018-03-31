const cookieParser = require('socket.io-cookie-parser');
const io = require('src/resources/io');
const {pubClient, subClient} = require('src/resources/redis');
const {db, pgp} = require('src/resources/db');
const server = require('src/resources/server');
const logger = require('src/utils/logger');
const NotificationsController = require('src/controllers/notifications');
const config = require('src/config');
const SECRET_KEY = config.get('SECRET_KEY');
const notifications = new NotificationsController(db, SECRET_KEY);

logger.log('Applications started!');

io.use(cookieParser());
io.use(notifications.onAuthentication.bind(notifications));
io.on('connection', notifications.onConnection.bind(notifications));
io.listen(server);

/**
 * Graceful shutdown handler
 */
function onShutdown() {
  logger.log('Applications shutdown!');
  io.close();
  pgp.end();
  pubClient.end();
  subClient.end();
  console.log('Closed');
}

for (const event of ['SIGINT', 'SIGTERM']) {
  process.once(event, onShutdown);
}

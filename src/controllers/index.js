const config = require('src/config');
const SECRET_TOKEN = config.get('SECRET_TOKEN');
const jwt = require('jsonwebtoken');
const logger = require('src/utils/logger');

class NotificationsController {
  constructor(redis) {
    this.redis = redis;
  }
  onConnection(socket) {
    const {session} = socket;
    socket.join(`user:${session.user_id}`);
    logger.info('User attached', session);
    socket.on('disconnect', (reason) => {
      logger.info('User detached', reason, session);
    });
  }
  async onAuthentication(socket, next) {
    try {
      const token = socket.request.headers.cookie.token;
      if (!token) {
        throw 'Token is not present!';
      }
      const {session_id} = jwt.verify(token, SECRET_TOKEN);
      const result = await this.redis.get(`session:${session_id}`);
      if (!result) {
        throw 'Missing session!';
      }
      socket.session = JSON.parse(result);
    } catch(e) {
      logger.warn('Error happened on login', e);
      next(new Error('Authentication error!'));
    }
  }
}

module.exports = NotificationsController;

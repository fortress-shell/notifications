const jwt = require('jsonwebtoken');
const logger = require('src/utils/logger');

/**
 * Notifications controller
 */
class NotificationsController {
    /**
     * Notifications constructor
     * @param  {Object} redis       redis connection
     * @param  {String} secretToken secret token for jwt
     */
  constructor(redis, secretToken) {
    this.redis = redis;
    this.secretToken = secretToken;
  }
  /**
   * New ws connection handler
   * @param  {Object} socket ws connection
   */
  onConnection(socket) {
    const {session} = socket;
    socket.join(`user:${session.user_id}`);
    logger.info('User attached', session);
    socket.on('disconnect', (reason) => {
      logger.info('User detached', reason, session);
    });
  }
  /**
   * Middleware to handle authentication
   * @param  {Object}   socket ws connection
   * @param  {Function} next   [description]
   */
  async onAuthentication(socket, next) {
    try {
      const token = socket.request.headers.cookie.token;
      if (!token) {
        throw new TypeError('Token is not present!');
      }
      const payload = jwt.verify(token, this.secretToken);
      const sessionKey = `session:${payload.session_id}`;
      const result = await this.redis.get(sessionKey);
      if (!result) {
        throw new TypeError('Missing session!');
      }
      socket.session = JSON.parse(result);
    } catch (e) {
      logger.warn('Error happened on login', e);
      next(new TypeError('Authentication error!'));
    }
  }
}

module.exports = NotificationsController;

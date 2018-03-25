const jwt = require('jsonwebtoken');
const logger = require('src/utils/logger');
const {CHECK_BUILD_PERMISSIONS} = require('src/queries/build');

/**
 * Notifications controller
 */
class NotificationsController {
    /**
     * Notifications constructor
     * @param  {Object} redis       redis connection
     * @param  {String} secretToken secret token for jwt
     */
  constructor(db, secretToken) {
    this.db = db;
    this.secretToken = secretToken;
  }
  /**
   * New ws connection handler
   * @param  {Object} socket ws connection
   */
  onConnection(socket) {
    socket.on('build:subscribe', this.subscribeToBuild.bind(this, socket));
    socket.join(`user:${socket.session.user_id}`);
    socket.on('disconnect', this.onDisconnect);
    logger.info('User attached', socket.session);
  }
  /**
   * Subscribe to build
   * @param  {Object} socket [description]
   * @param  {String} id     [description]
   */
  async subscribeToBuild(socket, id) {
    if (await this.db.oneOrNone(CHECK_BUILD_PERMISSIONS, {id})) {
      socket.join(`build:${id}`);
    } else {
      socket.disconnect(true);
    }
  }
  /**
   * [description]
   * @param  {[type]} reason [description]
   */
  onDisconnect(reason) {
    logger.info('User detached', reason, session);
  }
  /**
   * Middleware to handle authentication
   * @param  {Object}   socket ws connection
   * @param  {Function} next   [description]
   */
  async onAuthentication(socket, next) {
    try {
      const token = socket.request.headers.cookie.token;
      const payload = jwt.verify(token, this.secretToken);
      socket.session = await this.db.one(SELECT_SESSION, payload);
    } catch (e) {
      logger.warn('Error happened on login', e);
      next(new TypeError('Authentication error!'));
    }
  }
}

module.exports = NotificationsController;

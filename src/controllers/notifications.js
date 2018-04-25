'use strict';
const moment = require('moment');
const {verify} = require('jsonwebtoken');
const logger = require('src/utils/logger');
const {CHECK_EXISTANCE} = require('src/queries');

/**
 * Notifications controller
 */
class NotificationsController {
    /**
     * Notifications constructor
     * @param  {Object} db       db connection
     * @param  {String} secretToken secret token for jwt
     */
  constructor(db, secretToken) {
    this.db = db;
    this.SECRET_TOKEN = secretToken;
    this.USER_ATTACHED = 'User attached';
    this.USER_DETACHED = 'User detached';
    this.ERROR_ON_LOGIN = 'Error happened on login!';
  }
  /**
   * Middleware to handle authentication
   * @param  {Object}   socket ws connection
   * @param  {Function} next   [description]
   */
  async onAuthentication(socket, next) {
    const {SECRET_TOKEN, db} = this;
    try {
      const token = socket.request.cookies.token;
      const payload = verify(token, SECRET_TOKEN);
      const session = Object.freeze(payload);
      await db.one(CHECK_EXISTANCE, payload);
      socket.session = session;
      next();
    } catch (e) {
      logger.warn(ERROR_ON_LOGIN, e);
      next(new TypeError('Authentication error!'));
    }
  }
  /**
   * New ws connection handler
   * @param  {Object} socket ws connection
   */
  onConnection(socket) {
    const {session} = socket;
    const userRoomId = this.getUserRoomId(socket);
    const onSessionEnd = this.onSessionEnd.bind(this, socket);
    const sessionEnd = moment.unix(session.exp).diff(moment.utc());
    logger.info(this.USER_ATTACHED, session);
    socket.join(userRoomId);
    const timeout = setTimeout(onSessionEnd, sessionEnd);
    const onDisconnect = this.onDisconnect.bind(this, socket, timeout);                      t
    socket.on('disconnect', onDisconnect);
  }
  /**
   * Fired when user session finished
   * @param  {Object} socket [description]
   */
  onSessionEnd(socket) {
    socket.emit('session:end');
    socket.disconnect(true);
  }
  /**
   * Generated user root
   * @param  {Object} socket [description]
   * @return {String}        [description]
   */
  getUserRoomId({session}) {
    return `user:${session.user_id}`;
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
   * [onDisconnect description]
   * @param  {[type]} socket  [description]
   * @param  {[type]} timeout [description]
   * @param  {[type]} reason  [description]
   * @return {[type]}         [description]
   */
  onDisconnect(socket, timeout, reason) {
    logger.info(this.USER_DETACHED, reason, socket.session);
    clearTimeout(timeout);
  }
}

module.exports = NotificationsController;

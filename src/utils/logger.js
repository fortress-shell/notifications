const debug = require('debug');

exports.info = debug('notifications:info');
exports.warn = debug('notifications:warn');
exports.log = debug('notifications:log');
exports.error = debug('notifications:error');

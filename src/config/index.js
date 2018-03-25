'use strict';
const nconf = require('nconf');
const path = require('path');
nconf.env([
  'ADDV_PORT',
  'ADDV_IP',
  'NODE_ENV',
  'REDIS_URL',
  'DATABASE_URL',
  'SECRET_TOKEN',
]);
nconf.defaults({
  NODE_ENV: 'development',
});
nconf.required([
  'ADDV_PORT',
  'ADDV_IP',
  'REDIS_URL',
  'DATABASE_URL',
  'SECRET_TOKEN',
]);
const NODE_ENV = nconf.get('NODE_ENV');
nconf.file(NODE_ENV, {
  file: path.join(__dirname, `${NODE_ENV}.json`),
});
nconf.file('default', {
  file: path.join(__dirname, 'default.json'),
});

module.exports = nconf;

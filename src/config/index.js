'use strict';
const nconf = require('nconf');
const path = require('path');
nconf.env([
  'PORT',
  'IP',
  'NODE_ENV',
  'REDIS_URL',
  'SECRET_TOKEN',
]);
nconf.defaults({
  NODE_ENV: 'development',
});
nconf.required([
  'REDIS_URL',
  'SECRET_TOKEN',
  'PORT',
  'IP',
]);
const NODE_ENV = nconf.get('NODE_ENV');
nconf.file(NODE_ENV, {
  file: path.join(__dirname, `${NODE_ENV}.json`),
});
nconf.file('default', {
  file: path.join(__dirname, 'default.json'),
});

module.exports = nconf;

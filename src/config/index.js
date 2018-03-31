'use strict';
const nconf = require('nconf');
const path = require('path');
const optional = [
  'NODE_ENV',
];
const required = [
  'REDIS_URL',
  'DATABASE_URL',
  'SECRET_KEY',
];
nconf.env(optional.concat(required));
nconf.defaults({
  NODE_ENV: 'development',
});
nconf.required(required);
const NODE_ENV = nconf.get('NODE_ENV');
nconf.file(NODE_ENV, {
  file: path.join(__dirname, `${NODE_ENV}.json`),
});
nconf.file('default', {
  file: path.join(__dirname, 'default.json'),
});

module.exports = nconf;

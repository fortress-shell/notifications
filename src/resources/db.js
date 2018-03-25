'use strict';
const promiseLib = require('bluebird');
const config = require('src/config');
const pgp = require('pg-promise')({
  promiseLib,
});
const DATABASE_URL = config.get('DATABASE_URL');
const db = pgp(DATABASE_URL);

module.exports = {db, pgp};

'use strict';
const Redis = require("ioredis");
const config = require('src/config');
const REDIS_URL = config.get('REDIS_URL');
const redisUrls = REDIS_URL.split(',');

if (redisUrls.length > 1) {
  var redisClient = new Redis.Cluster(redisUrls);
} else if (redisUrls.length === 1) {
  redisClient = new Redis(REDIS_URL);
} else {
  throw 'Specify REDIS_URL env!';
}

module.exports = redisClient;

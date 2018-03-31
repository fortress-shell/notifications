'use strict';
const Redis = require('ioredis');
const config = require('src/config');
const REDIS_URL = config.get('REDIS_URL');
const redisUrls = REDIS_URL.split(',');

if (redisUrls.length > 1) {
  const cluster = new Redis.Cluster(redisUrls);
  module.exports = {
    pubClient: cluster,
    subClient: cluster,
  };
} else if (redisUrls.length === 1) {
  const pubClient = new Redis(REDIS_URL);
  const subClient = pubClient.duplicate();
  module.exports = {
    pubClient,
    subClient,
  };
} else {
  throw new TypeError('REDIS_URL is incorrect!');
}

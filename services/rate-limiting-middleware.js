var ExpressBrute = require('express-brute');
var RedisStore = require('express-brute-redis');
var redis = require('redis');

var redisClient = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

var expressBruteStore = new RedisStore({
  client: redisClient
});

var rateLimit = new ExpressBrute(expressBruteStore, {
  freeRetries: 80,
  minWait: 10,
  lifetime: 60 * 60,
  proxyDepth: 1
});

exports.rateLimit = rateLimit;
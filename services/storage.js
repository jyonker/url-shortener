var redis = require('redis');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
var redisClient = redis.createClient(process.env.REDIS_URL);

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

//redisClient.set("string key", "string val").then();
//redisClient.get('key').then();

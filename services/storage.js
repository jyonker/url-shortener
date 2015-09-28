var redis = require('redis');
var bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);

Storage = function() {
  this.redisClient = redis.createClient(process.env.REDIS_URL);

  this.redisClient.on("error", function (err) {
    console.log("Error " + err);
  });
};

Storage.prototype.getUrl = function(key) {
  return this.redisClient.getAsync(key);
};

Storage.prototype.createUrl = function(key, value) {
  return this.redisClient.setnxAsync(key, value);
};

Storage.prototype.urlExists = function(key) {
  return this.redisClient.existsAsync(key);
};

exports.Storage = Storage;
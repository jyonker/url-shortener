var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);

function wrapWithSanePromiseHandling(promise) {
  return promise.then(
    function success(resource) {
      if (!resource) {
        return Promise.reject();
      }

      return Promise.resolve(resource);
    },
    function failure(error) {
      return Promise.reject(error);
    });
}

Storage = function() {
  this.redisClient = redis.createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});

  this.redisClient.on("error", function (err) {
    console.log("Error " + err);
  });
};

Storage.prototype.getUrl = function(key) {
  return wrapWithSanePromiseHandling(
    this.redisClient.getAsync(key));
};

Storage.prototype.createUrl = function(key, value) {
  return wrapWithSanePromiseHandling(
    this.redisClient.setnxAsync(key, value));
};

Storage.prototype.urlExists = function(key) {
  return wrapWithSanePromiseHandling(
    this.redisClient.existsAsync(key));
};

exports.Storage = Storage;
/*! Copyright 2016 Jonathan Yonker

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
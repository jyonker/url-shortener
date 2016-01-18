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
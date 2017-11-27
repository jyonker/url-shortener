/*!
@license
Copyright 2016 Jonathan Yonker

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const Datastore = require('@google-cloud/datastore');
const projectId = 'linknoodle-187323';
const URL_KIND = 'URL';
const SETTINGS_KIND = 'Settings';

Storage = function() {
  if (process.env.NODE_ENV === 'production') {
    this.datastore = Datastore();
  } else {
    this.datastore = Datastore({
      projectId
    });
  }
};

Storage.prototype.getRedisCredentials = function() {
  const key = this.datastore.key([SETTINGS_KIND, 'Redis']);

  return this.datastore.get(key).then((data) => {
    return {
      url: data[0].redis_url,
      password: data[0].redis_password
    };
  });
};

Storage.prototype.getUrl = function(key) {
  const dbKey = this.datastore.key([URL_KIND, key]);

  return this.datastore.get(dbKey).then((data) => data[0].long);
};

Storage.prototype.createUrl = function(key, value) {
  const dbKey = this.datastore.key([URL_KIND, key]);

  const urlRecord = {
    key: dbKey,
    data: {
      short: key,
      long: value
    }
  };

  return this.datastore.save(urlRecord);
};

Storage.prototype.urlExists = function(key) {
  const dbKey = this.datastore.key([URL_KIND, key]);

  return this.datastore.get(dbKey).then((data) => {
    if (!data[0]) {
      return Promise.reject();
    }
  });
};

exports.Storage = Storage;
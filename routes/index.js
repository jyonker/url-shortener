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

module.exports = (app) => {
  const urlRegex = require('./../services/url-validation-regex.js').urlRegex;
  const Storage = require('./../services/storage.js').Storage;
  const chance = require('chance').Chance();
  const getRateLimit = require('./../services/rate-limiting-middleware.js').getRateLimit;
  const storage = new Storage();
  return getRateLimit().then((rateLimit) => {
    app.get('/:shortUrl', rateLimit.prevent, (request, response) => {
      var shortUrl = request.params.shortUrl;

      storage.getUrl(shortUrl)
        .then((longUrl) =>{
          response.status(301)
            .location(longUrl)
            .send(`<html><body><a href="${longUrl}">Page has moved here</a></body></html>`);
        })
        .catch(() => response.status(404).send());
    });

    function generateRandomShortUrl() {
      //Ambiguous chars removed from pool: 1, 0, capital or lower I, L, S, and O
      return chance.string({length: 6, pool: 'abcdefghjkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ23456789'});
    }

    function validateAndCleanUrl(shortUrlParam, shortUrlBody, longUrl, response) {
      //TODO: replace this with a blacklist
      if (shortUrlParam === 'api') {
        //TODO: remove this duplication
        response.status(400).send({error: {reason: 'Short URL already taken', field: 'shortUrl'}});
        return false;
      }

      if (shortUrlBody && shortUrlParam !== shortUrlBody) {
        response.status(400).send({error: {reason: 'Short URL name mismatch', field: 'shortUrl'}});
        return false;
      }

      if (!urlRegex.test(longUrl)) {
        longUrl = 'http://' + longUrl;
        if (urlRegex.test(longUrl)) {
          return longUrl;
        } else {
          response.status(400).send({error: {reason: 'Long URL is not valid URL', field: 'longUrl'}});
          return false;
        }
      }

      return longUrl;
    }

    function createUrl(shortUrl, bodyShortUrl, longUrl, response) {
      var cleanedLongUrl = validateAndCleanUrl(shortUrl, bodyShortUrl, longUrl, response);
      if (!cleanedLongUrl) {
        return;
      }

      storage.urlExists(shortUrl)
        .then(() => response.status(400).send({error: {reason: 'Short URL already taken', field: 'shortUrl'}}))
        .catch(() => {
          storage.createUrl(shortUrl, cleanedLongUrl)
            .then((data) => response.status(201).send({shortUrl: shortUrl, longUrl: cleanedLongUrl}))
            .catch((err) => {
                console.error('Error saving URL: ', err);
                response.status(500).send()
              }
            );
        });
    }

    app.put('/api/:apiVersion/url/:shortUrl', rateLimit.prevent, (request, response) => {
      var shortUrl = request.params.shortUrl;
      var longUrl = request.body.longUrl;

      createUrl(shortUrl, request.body.shortUrl, longUrl, response);
    });

    app.post('/api/:apiVersion/url/', rateLimit.prevent, (request, response) => {
      var shortUrl = generateRandomShortUrl();
      var longUrl = request.body.longUrl;

      createUrl(shortUrl, request.body.shortUrl, longUrl, response);
    });

    app.get('/api/:apiVersion/url/:shortUrl', rateLimit.prevent, (request, response) => {
      var shortUrl = request.params.shortUrl;

      storage.getUrl(shortUrl)
        .then((longUrl) => response.status(200).send({shortUrl: shortUrl, longUrl: longUrl}))
        .catch(() => response.status(404).send());
    });
  });

};

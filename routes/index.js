module.exports = function (app) {
  var urlRegex = require('./../services/url-validation-regex.js').urlRegex;
  var Storage = require('./../services/storage.js').Storage;
  var chance = require('chance').Chance();
  var storage = new Storage();

  app.get('/:shortUrl', function (request, response) {
    var shortUrl = request.params.shortUrl;

    storage.getUrl(shortUrl).then(
      function urlGetSuccess (longUrl) {
        response.status(301)
          .location(longUrl)
          .send('<html><body><a href="' + longUrl + '">Page has moved here</a></body></html>');
      },
      function urlGetFailure () {
        response.status(404).send();
      }
    );
  });

  function generateRandomShortUrl() {
    //Ambiguous chars removed from pool: 1, 0, capital or lower I, L, S, and O)
    return chance.string({length: 6, pool: 'abcdefghjkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ23456789'});
  }

  function validateAndCleanUrl(shortUrlParam, shortUrlBody, longUrl, response) {
    if (shortUrlParam === 'api') {
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
    if (cleanedLongUrl) {
      longUrl = cleanedLongUrl;

      storage.createUrl(shortUrl, longUrl).then(
        function urlCreateSuccess() {
          response.status(201).send({shortUrl: shortUrl, longUrl: longUrl});
        },
        //TODO: flatten this promise chain
        function urlCreateFailure() {
          return storage.urlExists(shortUrl).then(
            function urlExists () {
              response.status(400).send({error: {reason: 'Short URL already taken', field: 'shortUrl'}});
            },
            function urlDoesNotExist () {
              response.status(500).send();
            }
          );
        }
      );
    }
  }

  app.put('/api/:apiVersion/url/:shortUrl', function (request, response) {
    var shortUrl = request.params.shortUrl;
    var longUrl = request.body.longUrl;

    createUrl(shortUrl, request.body.shortUrl, longUrl, response);
  });

  app.post('/api/:apiVersion/url/', function (request, response) {
    var longUrl = request.body.longUrl;
    var shortUrl = generateRandomShortUrl();

    createUrl(shortUrl, request.body.shortUrl, longUrl, response);
  });

  app.get('/api/:apiVersion/url/:shortUrl', function (request, response) {
    var shortUrl = request.params.shortUrl;

    storage.getUrl(shortUrl).then(
      function urlGetSuccess (longUrl) {
        response.status(200).send({shortUrl: shortUrl, longUrl: longUrl});
      },
      function urlGetFailure () {
        response.status(404).send();
      }
    );
  });
};

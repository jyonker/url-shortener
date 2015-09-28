module.exports = function (app) {
  var urlRegex = require('./../services/url-validation-regex.js').urlRegex;
  var Storage = require('./../services/storage.js').Storage;
  var storage = new Storage();

  app.get('/', function (request, response) {
    response.send('Testing more...');
  });

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

  function validateAndCleanUrl(shortUrlParam, shortUrlBody, longUrl, response) {
    if (shortUrlBody && shortUrlParam !== shortUrlBody) {
      response.status(400).send({error: {reason: 'Short URL name mismatch'}});
      return false;
    }

    if (!urlRegex.test(longUrl)) {
      longUrl = 'http://' + longUrl;
      if (urlRegex.test(longUrl)) {
        return longUrl;
      } else {
        response.status(400).send({error: {reason: 'Long URL is not valid URL'}});
        return false;
      }
    }

    return longUrl;
  }

  app.put('/api/:apiVersion/url/:shortUrl', function (request, response) {
    var shortUrl = request.params.shortUrl;
    var longUrl = request.body.longUrl;

    var cleanedLongUrl = validateAndCleanUrl(shortUrl, request.body.shortUrl, longUrl, response);
    if (cleanedLongUrl) {
      longUrl = cleanedLongUrl;
    } else {
      return;
    }

    storage.createUrl(shortUrl, longUrl).then(
      function urlCreateSuccess () {
        response.status(201).send({shortUrl: shortUrl, longUrl: longUrl});
      },
      function urlCreateFailure () {
        response.status(500).send();
      }
    );
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

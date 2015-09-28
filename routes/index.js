module.exports = function (app) {
  var Storage = require('./../services/storage.js').Storage;
  var storage = new Storage();

  app.get('/', function (request, response) {
    response.send('Testing more...');
  });

  app.put('/api/:apiVersion/url/:shortUrl', function (request, response) {
    var shortUrl = request.params.shortUrl;
    var longUrl = request.body.longUrl;

    //TODO: throw error if body and params shortUrl don't match
    //TODO: throw error if longURl doesn't pass regex validation

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

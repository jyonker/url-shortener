module.exports = function(app) {
  var storage = require('./../services/storage.js');

  app.get('/', function (request, response) {
    response.send('Testing more...');
  });

  app.post('/api/:apiVersion/url', function (request, response) {
    console.log('apiVersion: ', request.params.apiVersion);

    response.status(201).send(request.body);
  });
};

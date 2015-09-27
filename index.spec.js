var request = require('supertest');

describe('main server', function () {
  var server;
  before(function () {
    server = require("./index.js").app;
  });

  it('should respond on /', function (done) {
    request(server)
      .get('/')
      .expect(200, "Testing...", done);
  });
});
var superTestRequest = require('supertest');

describe('url-shortener server', function () {
  var server;
  var request;

  before(function () {
    server = require('./app.js');
    request = superTestRequest(server);
  });

  it('should respond on /', function (done) {
    request
      .get('/')
      .expect(200, "Testing more...", done);
  });

  describe('api endpoints', function () {
    it('should allow short urls to be created with desired name', function (done) {
      var mockShortUrl = 'abc123';
      var mockLongUrl = 'http://www.google.com/';

      var mockUrlResource = {longUrl: mockLongUrl, shortUrl: mockShortUrl};
      request
        .post('/api/v1/url')
        .send(mockUrlResource)
        .expect(201, mockUrlResource, done);
    });
  });
});
//
//API: at /api/v1/
//POST /url  {longurl: “required string”, shorturl: “optional string”}
//create a new short url with a long url
//
//returns 201 (created)  with the new key/value resource in json,
// 400 (invalid request) if the requested url is bad for some reason…
//  maybe a url that fails regex validation or something, 500 (internal server error) if we can’t store it for some reason
//
//GET /url
//get long url by short url
//
//returns 200 if found, 404 if not found
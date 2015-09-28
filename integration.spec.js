var superTestRequest = require('supertest');

describe('url-shortener server', function () {
  var server;
  var request;
  var mockShortUrl;
  var mockLongUrl;

  function setupInitialUrlResource(done) {
    var mockUrlResource = {longUrl: mockLongUrl, shortUrl: mockShortUrl};
    request
      .put('/api/v1/url/' + mockShortUrl)
      .send(mockUrlResource)
      .end(done);
  }

  before(function () {
    server = require('./app.js');
    request = superTestRequest(server);
  });

  beforeEach(function (done) {
    mockShortUrl = 'abc123';
    mockLongUrl = 'http://www.google.com/';
    setupInitialUrlResource(done);
  });

  it('should respond on /', function (done) {
    request
      .get('/')
      .expect(200, "Testing more...", done);
  });

  describe('user endpoints', function () {
    it('should return redirect on found resource', function (done) {
      request
        .get('/' + mockShortUrl)
        .send()
        .expect(301)
        .expect('Location', mockLongUrl, done);
    });

    it('should return error on not found resource', function (done) {
      request
        .get('/someCrazyUrlThatPointsNowhere')
        .send()
        .expect(404, done);
    });
  });

  describe('api endpoints', function () {
    it('should allow short urls to be created with desired name', function (done) {
      var anotherMockShortUrl = 'someMoreRandomness';
      var anotherMockLongUrl = 'http://maps.google.com/';

      var mockUrlResource = {longUrl: anotherMockLongUrl, shortUrl: anotherMockShortUrl};
      request
        .put('/api/v1/url/' + anotherMockShortUrl)
        .send(mockUrlResource)
        .expect(201, mockUrlResource, done);
    });

    it('should allow long urls to be retrieved', function (done) {
      var mockUrlResource = {longUrl: mockLongUrl, shortUrl: mockShortUrl};
      request
        .get('/api/v1/url/' + mockShortUrl)
        .send()
        .expect(200, mockUrlResource, done);
    });

    it('should not allow short urls to be updated', function (done) {
      //TODO: once error handling is implemented, stop using 5xx code
      var mockUrlResource = {longUrl: mockLongUrl, shortUrl: 'someNewUrl'};
      request
        .put('/api/v1/url/' + mockShortUrl)
        .send(mockUrlResource)
        .expect(500, done);
    });

  });
});
//API: at /api/v1/
//PUT /url  {longurl: “string”, shorturl: “string”}
//create a new short url with a long url
//
//returns 201 (created)  with the new key/value resource in json, 400 (invalid request) if the requested url is bad for some reason… maybe a url that fails regex validation or something, 403 if the key already exists and you don’t have permissions to change it, 500 (internal server error) if we can’t store it for some reason
//allow changing an existing key if you are the user that created it (maybe tie in google oauth for fun in the future)
//
//GET /url
//get long url by short url
//
//returns 200 if found, 404 if not found
//
//POST /url
//create new randomized shortUrl from a longURl


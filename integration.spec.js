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
      .expect(200, done);
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
      var mockUrlResource = {longUrl: mockLongUrl, shortUrl: mockShortUrl};
      request
        .put('/api/v1/url/' + mockShortUrl)
        .send(mockUrlResource)
        .expect(500, done);
    });

    it('should allow short urls to be created without short url in body', function (done) {
      var anotherMockShortUrl = 'yetAnotherOne';
      var anotherMockLongUrl = 'http://maps.google.com/';

      var mockUrlResource = {longUrl: anotherMockLongUrl, shortUrl: anotherMockShortUrl};
      request
        .put('/api/v1/url/' + anotherMockShortUrl)
        .send({longUrl: anotherMockLongUrl})
        .expect(201, mockUrlResource, done);
    });

    it('should not allow short urls to be created with body and url name mismatch', function (done) {
      var anotherMockShortUrl = 'evenMoreFakeNames';
      var anotherMockLongUrl = 'http://maps.google.com/';

      var mockUrlResource = {longUrl: anotherMockLongUrl, shortUrl: 'whoops!'};
      request
        .put('/api/v1/url/' + anotherMockShortUrl)
        .send(mockUrlResource)
        .expect(400, done);
    });

    describe('with url validation', function () {
      function testWithLongUrl(badMockUrl) {
        it('should fail if long url "' + badMockUrl + '" fails url validation', function (done) {

          var anotherMockShortUrl = 'anotherFakeName...';

          var mockUrlResource = {longUrl: badMockUrl, shortUrl: anotherMockShortUrl};
          request
            .put('/api/v1/url/' + anotherMockShortUrl)
            .send(mockUrlResource)
            .expect(400, done);
        });
      }

        testWithLongUrl('httpz://google.com/');
        testWithLongUrl('http:/google.com/');
        testWithLongUrl('websocket://google.com/');
        testWithLongUrl('blah://something.com');
        testWithLongUrl('http://.com/');

        testWithLongUrl('http://localhost/');
        testWithLongUrl('http://127.0.0.1/');
    });

    it('should append protocol to url if needed', function (done) {
      var moreMockShortUrl = 'somethingCool';
      request
        .put('/api/v1/url/' + moreMockShortUrl)
        .send({longUrl: 'google.com'})
        .expect(201, {longUrl: 'http://google.com', shortUrl: moreMockShortUrl}, done);

    });
  });
});


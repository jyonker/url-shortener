/*
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

    it('should allow short urls to be created with no name', function (done) {
      var anotherMockLongUrl = 'http://maps.google.com/';

      var mockUrlResource = {longUrl: anotherMockLongUrl};
      request
        .post('/api/v1/url/')
        .send(mockUrlResource)
        .expect(function(response) {
          if (response.body.longUrl !== anotherMockLongUrl) {
            return "Returned long url does not match input";
          }

          if (!response.body.shortUrl.length) {
            return "No generated short url returned";
          }
        })
        .expect(201, done);
    });

    it('should allow long urls to be retrieved', function (done) {
      var mockUrlResource = {longUrl: mockLongUrl, shortUrl: mockShortUrl};
      request
        .get('/api/v1/url/' + mockShortUrl)
        .send()
        .expect(200, mockUrlResource, done);
    });

    it('should not allow short urls to be updated', function (done) {
      var mockUrlResource = {longUrl: mockLongUrl, shortUrl: mockShortUrl};
      request
        .put('/api/v1/url/' + mockShortUrl)
        .send(mockUrlResource)
        .expect(400, {error: {reason: 'Short URL already taken', field: 'shortUrl'}}, done);
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

    it('should not allow short url to be called api', function (done) {
      var anotherMockShortUrl = 'api';
      var anotherMockLongUrl = 'http://maps.google.com/';

      var mockUrlResource = {longUrl: anotherMockLongUrl, shortUrl: anotherMockShortUrl};
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


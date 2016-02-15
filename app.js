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

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');
var mime = require('mime');
var app = express();
module.exports = app;

function setCustomStaticFileHeaders(res, path) {
  if (mime.lookup(path) === 'text/html') {
    res.setHeader('Cache-Control', 'no-cache')
  }
}

app.set('port', (process.env.PORT || 5000));

app.use(compression());

//TODO: how do we get this to fail gracefully on bad json?
app.use(bodyParser.json());

var staticFilesConfiguration = {
  maxAge: '1y',
  setHeaders: setCustomStaticFileHeaders
};

if (process.env.PRODUCTION_MODE === 'true') {
  app.use(express.static(__dirname + '/dist', staticFilesConfiguration));
}

app.use(express.static(__dirname + '/public', staticFilesConfiguration));

require('./routes/index.js')(app);

app.use(function(request, response, next) {
  response.status(404).send('Sorry, we couldn\'t find that link! (404)');
});

app.use(function(error, request, response, next) {
  response.status(500).send('Sorry, we ran into an error looking for that link! (500)');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


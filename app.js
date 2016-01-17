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

app.use(express.static(__dirname + '/public', {
  //maxAge: '1y',
  setHeaders: setCustomStaticFileHeaders
}));

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


var express = require('express');
var app = express();
module.exports.app = app;

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('Testing...');
});

var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


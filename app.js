var express = require('express');
var bodyParser = require('body-parser');
var app = express();
module.exports = app;

app.set('port', (process.env.PORT || 5000));

//TODO: how do we get this to fail gracefully on bad json?
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

require('./routes/index.js')(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


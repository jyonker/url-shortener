var express = require('express');
var bodyParser = require('body-parser');
var app = express();
module.exports = app;

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

require('./routes/index.js')(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


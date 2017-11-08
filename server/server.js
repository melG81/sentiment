require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Connect to MongoDB on start
var db = require('./db/connection.js');
db.connect();

// Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set bodyparser middleware. Set limit to 50mb in order to accept larger payload
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use(require('./routes/index'));

// Catch and send error messages
app.use(function (err, req, res, next) {
  if (err) {
    res.status(422).json({
      error: err.message
    });
  } else {
    next();
  }
});

// 404
app.use(function (req, res) {
  res.status(404).json({
    status: 'Page does not exist'
  });
});

const PORT = process.env.PORT || 3000;
// Expose and listen
app.listen(PORT, function () {
  console.log(`Listening to port ${PORT}`);
});

module.exports = app;
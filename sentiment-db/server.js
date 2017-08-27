var express = require('express');
var bodyParser = require('body-parser');

var app = express();

<<<<<<< HEAD
// Connect to MongoDB on start
var db = require('./db/connection.js');
db.connect();

=======
>>>>>>> e8768128e192151a03e1e7359193d5d8b3779f5a
// Set bodyparser middleware
app.use(bodyParser.json());

// Routes 
app.use(require('./routes/index'));

<<<<<<< HEAD
=======

>>>>>>> e8768128e192151a03e1e7359193d5d8b3779f5a
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
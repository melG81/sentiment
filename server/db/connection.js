let db = module.exports = {};

// Dependencies
var mongoose = require('mongoose');
// Use ES6 Promises for mongoose
mongoose.Promise = global.Promise;

// Set environment variables
var config = process.env.NODE_ENV || 'development';

db.connect = function () {
  if (config === 'development') {
    mongoose.connect('mongodb://localhost:27017/sentiment-development', {useMongoClient: true});
  } else if (config === 'test') {
    mongoose.connect('mongodb://localhost:27017/sentiment-test', {useMongoClient: true});
  }

  // Signal connection
  mongoose.connection.once('open', function () {
    console.log('Connection has been made');
  }).on('error', function (error) {
    console.log('Connect error', error);
  })
};

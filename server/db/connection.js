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
  } else {
    // Using mongoose to connect to MLAB database (Create new database single node free and create new user and set name and password)
    const username = process.env.MONGO_USER;
    const password = process.env.MONGO_PW;
    // `mongodb://${username}:${password}@ds139816-a0.mlab.com:39816/sentiment-production-live`
    mongoose.connect(`mongodb://${username}:${password}@ds139816-a0.mlab.com:39816,ds139816-a1.mlab.com:39816/sentiment-production-live?replicaSet=rs-ds139816`, {
      useMongoClient: true
    });
  }

  // Signal connection
  mongoose.connection.once('open', function () {
    console.log('Connection has been made');
  }).on('error', function (error) {
    console.log('Connect error', error);
  })
};

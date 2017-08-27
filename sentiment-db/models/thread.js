// Dependencies
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  topic: String,
  createdAt: Date
});

let Thread = mongoose.model('Thread', Schema);

module.exports = Thread;
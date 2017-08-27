// Dependencies
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  topic: String
},{
  timestamps: true
});

let Thread = mongoose.model('Thread', Schema);

module.exports = Thread;
// Dependencies
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    topic: String,
    posts: mongoose.Schema.Types.Mixed
  },{
    timestamps: true
});

let Thread = mongoose.model('Thread', Schema);

module.exports = Thread;
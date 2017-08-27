// Dependencies
var mongoose = require('mongoose');

// Thread Schema
// `topic` represents any given topic name
// `posts` represents the API payload which will be backed up (mixed schema, will change)
// `timestamps` options is set to true which creates by default a `createdAt` and `updatedAt` Date key
var Schema = new mongoose.Schema({
    topic: String,
    posts: mongoose.Schema.Types.Mixed
  },{
    timestamps: true
});

let Thread = mongoose.model('Thread', Schema);

module.exports = Thread;
// Dependencies
var mongoose = require('mongoose');

var CommentSchema = require('./comment.js');

// Thread Schema
// `topic` represents array of topic query/ tags e.g. ['bitcoin', 'crypto', 'monero']
// `post` represents the parsed API post payload which will be backed up (mixed schema, will change)
// `google` represents the google cloud language analysis object results of the post text
// `timestamps` options is set to true which creates by default a `createdAt` and `updatedAt` Date key
var Schema = new mongoose.Schema({
    topic: [String],
    post: mongoose.Schema.Types.Mixed,
    documentSentiment: mongoose.Schema.Types.Mixed,
    votes: {
     type: Number,
     default: 0
    },
    comments: [CommentSchema]
  },{
    timestamps: true
});

let Thread = mongoose.model('Thread', Schema);

module.exports = Thread;
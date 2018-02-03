// Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new mongoose.Schema({
  text: String,
  comment_id: Schema.Types.ObjectId,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  },{
    timestamps: true
});


module.exports = CommentSchema;


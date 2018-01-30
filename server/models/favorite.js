// Dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FavoriteSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: 'Thread'    
  }
}, {
  timestamps: true
});

let Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;
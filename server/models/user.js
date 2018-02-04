// Dependencies
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    admin: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
});

let User = mongoose.model('User', Schema);

module.exports = User;
let users = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let User = require('../models/user');
let _ = require('lodash')

users.index = function (req, res, next) {
  User.find({})
    .then(data => res.status(200).send(data))
    .catch(next);
};

users.show = function (req, res, next) {
  User.findById(req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next);
};


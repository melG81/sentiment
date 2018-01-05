let users = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let User = require('../models/user');
let _ = require('lodash')
let bcrypt = require('bcrypt')

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

users.findByEmail = function (req, res, next) {
  User.find({email: req.params.email})
    .then(data => res.status(200).send(data))
    .catch(next);
};

users.create = function (req, res, next) {
  let {email, password, admin} = req.body
  let payload = {
    email: email,
    password: bcrypt.hashSync(password, 10),
    admin: admin
  }
  User.create(payload)
    .then(data => res.status(200).send(data))
    .catch(next);
};

users.update = function (req, res, next) {
  let {email, password, admin} = req.body
  let payload = _.omitBy({
    email,
    password: bcrypt.hashSync(password, 10),
    admin
  }, _.isNil)

  User.findByIdAndUpdate(req.params.id, payload, {new:true})
    .then(data => res.status(200).send(data))
    .catch(next);
};

users.delete = function (req, res, next) {
  User.findByIdAndRemove(req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next);
};


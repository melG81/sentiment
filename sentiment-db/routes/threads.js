let threads = module.exports = {};

// Dependencies
var mongoose = require('mongoose');
var Thread = require('../models/thread');

threads.index = function (req, res, next) {
  Thread.find({})
    .then(data => res.status(200).send(data))
    .catch(next);
};

threads.create = function (req, res, next) {
  Thread.create(req.body)
    .then(data => res.send(data))
    .catch(next);
};

threads.topic = function (req, res, next) {
  let topic = req.params.topic;
  Thread.find({topic})
    .then(data => res.status(200).send(data))
    .catch(next)
}

threads.topicLatest = function (req, res, next) {
  let topic = req.params.topic;
  Thread
    .find({topic})
    .sort({createdAt: -1})
    .limit(1)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(next)
}

threads.topicDelete = function (req, res, next) {
  Thread.findByIdAndRemove(req.params.id)
    .then(data => res.send(data))
    .catch(next)
}

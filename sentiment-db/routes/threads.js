let threads = module.exports = {};

// Dependencies
var mongoose = require('mongoose');
var Thread = require('../models/thread');

/**
 * @function {fetches all thread documents}
 */
threads.index = function (req, res, next) {
  Thread.find({})
    .then(data => res.status(200).send(data))
    .catch(next);
};

/**
 * @function {creates a new thread document}
 */
threads.create = function (req, res, next) {
  Thread.create(req.body)
    .then(data => res.send(data))
    .catch(next);
};

/**
 * @function {fetches all thread documents with topic name provided in req.params.topic}
 */
threads.topic = function (req, res, next) {
  let topic = req.params.topic;
  Thread.find({topic})
    .then(data => res.status(200).send(data))
    .catch(next)
}

/**
 * @function {fetches latest single thread document with topic name provided in req.params.topic}
 */
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

/**
 * @function {deletes a single thread document based on id provided in req.params.id}
 */
threads.topicDelete = function (req, res, next) {
  Thread.findByIdAndRemove(req.params.id)
    .then(data => res.send(data))
    .catch(next)
}

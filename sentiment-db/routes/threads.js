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

// exports.show = function (req, res, next) {
//   Movie.findById(req.params.id)
//     .populate('comments.user', 'name')
//     .then((data) => {
//       res.send(data)
//     })
//     .catch(next);
// };

// exports.update = function (req, res, next) {
//   Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     .then(data => res.send(data))
//     .catch(next);
// };

// exports.delete = function (req, res, next) {
//   Movie.findByIdAndRemove(req.params.id)
//     .then(data => res.send(data))
//     .catch(next);
// };
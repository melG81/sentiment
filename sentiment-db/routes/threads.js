let threads = module.exports = {};

// Dependencies
// var mongoose = require('mongoose');
// var Movie = require('../models/movie');

threads.index = function (req, res, next) {
  res.status(200).json({
    data: [
      { topic: 'bitcoin' },
      { topic: 'monero' },
      { topic: 'gold' }
    ]
  })  
};

// exports.create = function (req, res, next) {
//   Movie.create(req.body)
//     .then(data => res.send(data))
//     .catch(next);
// };

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
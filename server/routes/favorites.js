let favorites = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let Thread = require('../models/thread');
let Favorite = require('../models/favorite');
let _ = require('lodash')
let moment = require('moment')

favorites.index = function (req, res, next) {
  Favorite.find({})
    .then(data => res.status(200).send(data))
    .catch(next);
};

favorites.show = function (req, res, next) {
  let userId = req.params.id
  Favorite
    .find({ user: userId })
    .then(resp => {
      let threadArr = resp.map(el => el.thread)
      return Thread.find({ '_id': { $in: threadArr } })
    })
    .then(resp => res.send(resp))
    .catch(next)

}

favorites.delete = function (req, res, next) {
  Favorite.findByIdAndRemove(req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next);
};

favorites.deleteByUserAndThread = function (req, res, next) {
  let userId = req.params.user_id
  let threadId = req.params.thread_id

  Favorite.find({
    user: userId,
    thread: threadId
  })
  .then(result => {
    let favId = result[0]._id
    return Favorite.findByIdAndRemove(favId)
  })
  .then(data => res.status(200).send(data))
  .catch(next);
};




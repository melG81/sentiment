// Authentication
let passport = require('passport')
require('./passport.js')

// Dependencies
let _ = require('lodash')
let dbClient = require('../src/util/dbClient')

exports.show = (req, res, next) => {
  let userId = _.get(req, 'user._id')
  
  dbClient.getUserFavorites(userId).then( payload => {
    let data = payload.data
    res.render('users/favorites', {
      message: req.flash('message')[0],
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      data,
      isFave: true
    })
  })
}

exports.create = (req, res, next) => {
  let userId = _.get(req, 'user._id')
  let threadId = req.params.thread_id  

  dbClient.createFavorite(userId, threadId).then(payload => {
    res.redirect(`/favorites/${userId}`)
  })
  .catch(next)  
}

exports.delete = (req, res, next) => {
  let userId = _.get(req, 'user._id')
  let threadId = req.params.thread_id  
  dbClient.deleteFavorite(userId, threadId).then(payload => {
    res.redirect(`/favorites/${userId}`)
  })
  .catch(next)    
}
let express = require('express')
let router = express.Router()
let {checkVoteCookie} = require('./helpers')

// Authorisation endpoints
let auth = require('./auth.js')
router
  .post('/login', auth.login)
  .get('/login', auth.loginPage)
  .get('/logout', auth.logout)
  .get('/profile', auth.profilePage)
  .post('/signup', auth.signup)
  .get('/signup', auth.signupPage)

// Threads CRUD endpoints
let topics = require('./topics.js')
router
  .get('/', topics.index)
  .get('/fundamentals', topics.fundamentals)
  .get('/topics/browse', topics.browse)
  .get('/topics/news/:title/:id', topics.article)
  .get('/topics/new', auth.loginRequired, topics.new)
  .post('/topics', topics.create)
  .get('/topics/:name', topics.index)
  .get('/topics/topic/id/:id/upvote', topics.upVote)
  .get('/topics/topic/id/:id/downvote', topics.downVote)
  .get('/topics/topic/id/:id', topics.getById)
  .post('/topics/pollscript', topics.pollscript)
  .delete('/topics/topic/id/:id', topics.delete)  

// Thread single endpoints
let threads = require('./threads.js')
router
  .get('/threads/:id', threads.show)

// Comments endpoints
let comments = require('./comments.js')
router  
  .post('/comments', comments.create)
  .get('/commentsDelete/:thread_id/:comment_id', auth.adminRequired, comments.delete)

// Sitemap
let sitemap = require('./sitemap.js')
router
  .get('/sitemap', sitemap.index )

// Favorites endpoints
let favorites = require('./favorites.js')
router
  .get('/favorites/:user_id', auth.loginRequired, favorites.show)
  .get('/fave/:thread_id', auth.signupRequired, favorites.create)
  .get('/unfave/:thread_id', auth.loginRequired, favorites.delete)

// Users endpoints
let users = require('./users.js')
router
  .get('/users', auth.adminRequired, users.index)

// Admin endpoints
let admin = require('./admin.js')
router
  .get('/admin', auth.adminRequired, admin.index)

// Static page endpoints
let static = require('./static.js')
router  
  .get('/resources', static.resources)

  module.exports = router
let express = require('express')
let router = express.Router()
let {checkVoteCookie} = require('./helpers')

// Threads CRUD endpoints
let topics = require('./topics.js')
router
  .get('/', topics.index)
  .get('/fundamentals', topics.fundamentals)
  .get('/topics/browse', topics.browse)
  .get('/topics/news/:title/:id', topics.article)
  .get('/topics/:name', topics.index)
  .get('/topics/topic/id/:id/upvote', topics.upVote)
  .get('/topics/topic/id/:id/downvote', topics.downVote)
  .get('/topics/topic/id/:id', topics.getById)
  .post('/topics/pollscript', topics.pollscript)

// Sitemap
let sitemap = require('./sitemap.js')
router
  .get('/sitemap', sitemap.index )

// Authorisation endpoints
let auth = require('./auth.js')
router
  .post('/login', auth.login)
  .get('/login', auth.loginPage)
  .get('/logout', auth.logout)

// Admin endpoints
let admin = require('./admin.js')
router
  .get('/admin', auth.loginRequired, admin.index)


module.exports = router
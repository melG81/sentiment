let express = require('express')
let router = express.Router()
let {checkVoteCookie} = require('./helpers')

// Root page
router.get('/', function (req, res, next) {
  res.render('home')
})

// Threads CRUD endpoints
let topics = require('./topics.js')
router
  .get('/topics/browse', topics.browse)
  .get('/topics/:name', topics.show)
  .get('/topics', topics.index)
  .get('/topics/topic/id/:id/upvote', checkVoteCookie, topics.upVote)
  .get('/topics/topic/id/:id/downvote', checkVoteCookie, topics.downVote)
  .get('/topics/topic/id/:id', topics.getById)
  .post('/topics/pollscript', topics.pollscript)


// Admin endpoints
let admin = require('./admin.js')
router
  .get('/admin', admin.index)

module.exports = router
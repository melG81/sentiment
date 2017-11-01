let express = require('express')
let router = express.Router()

// Root page
router.get('/', function (req, res, next) {
  res.render('home')
})

// Threads CRUD endpoints
let topics = require('./topics.js')
router
  .get('/topics/:name', topics.show)
  .get('/topics', topics.index)

// Admin endpoints
let admin = require('./admin.js')
router
  .get('/admin', admin.index)

module.exports = router
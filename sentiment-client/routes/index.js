var express = require('express');
var router = express.Router();

// Root page
router.get('/', function (req, res, next) {
  res.render('home');
})

// Threads CRUD endpoints
var topics = require('./topics.js');
router
  .get('/topics/:name', topics.show)
  .get('/topics', topics.index)

module.exports = router;
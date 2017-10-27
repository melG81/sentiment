var express = require('express');
var router = express.Router();

// Root page
router.get('/', function (req, res, next) {
  res.status(200).json({ status: 'ok' });
})

// Threads CRUD endpoints
var topics = require('./topics.js');
router
  .get('/topics/:name', topics.show)

module.exports = router;
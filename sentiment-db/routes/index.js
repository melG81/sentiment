var express = require('express');
var router = express.Router();

// Root page
router.get('/', function(req, res, next){
  res.status(200).json({status: 'ok'});
})

// Threads CRUD endpoints
var threads = require('./threads.js');
router
  .get('/threads/author/:author', threads.author)
  .get('/threads', threads.index)
  .post('/threads/sites', threads.sites)
  .post('/threads', threads.create)
  .get('/threads/topic/:topic/latest', threads.topicLatest)
  .get('/threads/topic/query', threads.topicQuery)
  .get('/threads/topic/:topic', threads.topic)
  .delete('/threads/topic/id/:id', threads.topicDelete)
  .put('/threads/topic/id/:id', threads.topicUpdate)

module.exports = router;
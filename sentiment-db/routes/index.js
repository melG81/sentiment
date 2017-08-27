var express = require('express');
var router = express.Router();

// Root page
router.get('/', function(req, res, next){
  res.status(200).json({status: 'ok'});  
})

// Threads CRUD endpoints
var threads = require('./threads.js');
router
  .get('/threads', threads.index)
  .post('/threads', threads.create)
  .get('/threads/topic/:topic/latest', threads.topicLatest)
  .get('/threads/topic/:topic', threads.topic)
  .delete('/threads/topic/id/:id', threads.topicDelete)
  

module.exports = router;
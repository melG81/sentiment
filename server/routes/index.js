var express = require('express');
var router = express.Router();

// Root page
router.get('/', function(req, res, next){
  res.status(200).json({status: "ok"});
})

// Threads CRUD endpoints
var threads = require('./threads.js');
router
  .get('/threads/topic/id/:id', threads.show)
  .get('/threads/author/:author', threads.author)
  .put('/threads/topic/id/:id', threads.topicUpdate)
  .post('/threads/sites', threads.sites)
  .post('/threads', threads.create)
  .get('/threads/topic/query', threads.topicQuery)
  .get('/threads', threads.paginate)
  .get('/threads/all', threads.index)
  .get('/threads/topic/:topic/latest', threads.topicLatest)
  .get('/threads/topic/:topic', threads.topic)  
  .get('/threads/:id', threads.show)
  .delete('/threads/topic/id/:id', threads.topicDelete)

// Comments CRUD endpoints
var comments = require('./comments.js');
router
  .post('/comments', comments.create)
  
// Users CRUD endpoints
var users = require('./users.js');
router
  .get('/users', users.index)
  .get('/users/email/:email', users.findByEmail)
  .get('/users/:id', users.show)
  .post('/users', users.create)
  .put('/users/:id', users.update)
  .delete('/users/:id', users.delete)

// Favorites CRUD endpoints
var favorites = require('./favorites.js');
router
  .get('/favorites', favorites.index)
  .post('/favorites', favorites.create)
  .get('/users/:id/favorites', favorites.show)
  .delete('/favorites/:user_id/:thread_id', favorites.deleteByUserAndThread)  
  .delete('/favorites/:id', favorites.delete)


module.exports = router;
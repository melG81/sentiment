let threads = module.exports = {};

// Dependencies
var mongoose = require('mongoose');
var Thread = require('../models/thread');
var _ = require('lodash')

/**
 * @function {fetches all thread documents}
 */
threads.index = function (req, res, next) {
  Thread.find({})
    .then(data => res.status(200).send(data))
    .catch(next);
};

/**
 * fetches all threads with the given author name
 */
threads.author = function (req, res, next) {
  let author = req.params.author
  Thread.find({'posts.author': {$regex: new RegExp(author, "i")}})
    .then(threads => {
      let posts = threads.map(thread => {
        return thread.posts.filter(post => post.author.toLowerCase() === author.toLowerCase())
      })
      return _.flatten(posts)
    })
    .then(posts => res.send(posts))
    .catch(next)
}


/**
 * @function {creates a new thread document}
 */
threads.create = function (req, res, next) {
  // Validate if thread post uuid already exists
  let payload = req.body
  let uuid = _.get(payload, 'post.uuid')
  let topic = _.get(payload, 'topic')[0]
  Thread.find({'post.uuid': uuid})
    .then(results => {
      if (results.length > 0) {
        let result = results[0]
        let hasTopic = _.includes(result.topic, topic)
        if (hasTopic) {
          res.send({
            message: 'Post already exists'
          });
        } else {
          let newTopic = _.concat(result.topic, topic)          
          let newPayload = Object.assign({}, payload, {
            topic: newTopic
          })
          Thread.findByIdAndUpdate(result._id, newPayload, { new: true })
            .then(data => res.send(data))
            .catch(next);
        }        
      } else {
        Thread.create(payload)
          .then(data => res.send(data))
          .catch(next);
      }
    })
};

/**
 * @function {fetches all thread documents with topic name provided in req.params.topic}
 */
threads.topic = function (req, res, next) {
  let topic = req.params.topic;
  Thread.find({topic})
    .then(data => res.status(200).send(data))
    .catch(next)
}

/**
 * @function {fetches latest single thread document with topic name provided in req.params.topic}
 */
threads.topicLatest = function (req, res, next) {
  let topic = req.params.topic;
  Thread
    .find({topic})
    .sort({createdAt: -1})
    .limit(1)
    .exec()
    .then(data => res.status(200).send(data))
    .catch(next)
}

/**
 * @function {deletes a single thread document based on id provided in req.params.id}
 */
threads.topicDelete = function (req, res, next) {
  Thread.findByIdAndRemove(req.params.id)
    .then(data => res.send(data))
    .catch(next)
}

/**
 * @function {updates the entire document}
 */
threads.topicUpdate = function (req, res, next) {
  Thread.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(data => res.send(data))
    .catch(next);
}
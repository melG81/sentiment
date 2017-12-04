// Design Pattern: Using chain-of-responsibility node design pattern

// Dependencies
let Thread = require('../../models/thread');
let _ = require('lodash')

// If post id doest not exist then create new otherwise call next
let CheckPostId = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }
  this.exec = function (opts) {
    let { payload, uuid, req, res, next } = opts
    Thread.find({ 'post.uuid': uuid })
      .then(results => {
        if (results.length > 0) {
          let post = results[0]
          return this.next.exec(Object.assign(opts, { post }))
        } else {
          Thread.create(payload)
            .then(data => {
              console.log('created: ', data.post.title);
              res.send(data)
            })
            .catch(next)
        }
      })
  }
}

// If post already has same topic then send message that post exists otherwise call next
let CheckPostTopic = function () {
  this.next = null
  this.setNext = function (fn) {
    this.next = fn
  }
  this.exec = function (opts) {
    let { post, topic, req, res, next } = opts
    let hasTopic = _.includes(post.topic, topic)
    if (hasTopic) {
      console.log('post already exists');
      res.send({
        message: 'Post already exists'
      });
    } else {
      this.next.exec(opts)
    }
  }
}

// Update post with new topic
let UpdatePostTopic = function () {
  this.exec = function (opts) {
    let { post, payload, topic, req, res, next } = opts

    let newTopic = _.concat(post.topic, topic)
    let newPayload = Object.assign({}, payload, {
      topic: newTopic
    })

    Thread.findByIdAndUpdate(post._id, newPayload, { new: true })
      .then(data => {
        console.log('updated: ', data.topic);
        res.send(data)
      })
      .catch(next)
  }
}

module.exports = { CheckPostId, CheckPostTopic, UpdatePostTopic }
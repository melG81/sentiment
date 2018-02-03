let comments = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let Thread = require('../models/thread');
let Comment = require('../models/comment');
let _ = require('lodash')

comments.create = function (req, res, next) {
  let { threadId, userId, text } = req.body
  let commentId = _.get(req, 'body.commentId', null)
  Thread
    .findById(threadId)
    .then(resp => {
      let thread = resp
      let comment = {
        text,
        user: userId,
        comment_id: commentId
      }
      thread.comments.push(comment)
      return thread.save()
    })
    .then(resp => {
      res.send(resp)
    })
}

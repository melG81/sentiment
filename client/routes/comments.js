let comments = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let _ = require('lodash')
var sanitizeHtml = require('sanitize-html');

comments.create = function (req, res, next) {
  let { threadId, userId, commentId, text } = req.body
  let clean = sanitizeHtml(text)
  let payload = { threadId, userId, commentId, text: clean }
  let login = req.isAuthenticated()
  if (!login) {
    res.redirect('/signup')
  }
  dbClient.createComment(payload)
    .then(payload => {
      res.redirect(`threads/${threadId}`)
    })
}

comments.delete = function (req, res, next) {
  let threadId = req.params.thread_id
  let commentId = req.params.comment_id
  console.log(commentId, threadId);
  dbClient.deleteComment(threadId, commentId)
    .then(() => {
      res.redirect(`/threads/${threadId}`)
    })
}
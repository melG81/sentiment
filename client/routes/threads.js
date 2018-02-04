let threads = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let _ = require('lodash')
let { parseHtml } = require('../src/util/helpers')
let moment = require('moment');

threads.show = function (req, res, next) {
  let id = req.params.id
  let user = _.get(req, 'user')
  let isAdmin = _.get(req, 'user.admin') && req.isAuthenticated()
  dbClient.getDoc(id)
    .then(payload => {
      let data = payload.data
      res.render('threads/show', {
        data,
        user,
        isAdmin
      })   
    })
}
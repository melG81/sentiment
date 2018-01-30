// Dependencies
let _ = require('lodash')
let dbClient = require('../src/util/dbClient')

exports.index = (req, res, next) => {
  dbClient.getUsers().then(payload => {
    let data = payload.data
    res.render('users/index', {data})
  })
}

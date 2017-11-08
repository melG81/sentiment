let admin = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let _ = require('lodash')
let queryKeywords = require('../src/filters/queryKeywords.js')

admin.index = function (req, res, next) {
  res.render('admin/index', {
    queryKeywords
  })
}


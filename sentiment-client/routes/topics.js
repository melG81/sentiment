let topics = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let sitesArr = require('../src/filters/sitesFiltered.js')
let _ = require('lodash')
let {sortPayload} = require('./helpers')

topics.index = function (req, res, next) {
  dbClient.getAll()
    .then(payload => {
      let data = payload.data;
      res.render('topics/show', {
        topicName: 'all',
        data: sortPayload(data)
      })
    })
}

topics.show = function (req, res, next) {
  let topicName = req.params.name
  let sortQuery = req.query.sort
  dbClient.getByTopicAndSites(topicName, sitesArr)
    .then(payload => {
      let data = payload.data
      res.render('topics/show',{
        topicName,
        data: sortPayload(data, sortQuery)
      })
    })
    .catch(next)
}


let topics = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let _ = require('lodash')
let {sortPayload} = require('./helpers')
let queryKeywords = require('../src/filters/queryKeywords.js')

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
  let topicsArr = _.castArray(topicName)
  let daysAgo = req.query.daysAgo || 3
  let sortQuery = req.query.sort
  dbClient.getByTopics(topicsArr, daysAgo)
    .then(payload => {
      let data = payload.data
      res.render('topics/show',{
        topicName,
        daysAgo,
        data: sortPayload(data, sortQuery)
      })
    })
    .catch(next)
}

topics.browse = function (req, res, next) {
  let topics = req.query.topic
  let topicsArr = _.castArray(topics)
  let daysAgo = req.query.daysAgo || 3
  let sortQuery = req.query.sort
  dbClient.getByTopics(topicsArr, daysAgo)
    .then(payload => {
      let data = payload.data
      res.render('topics/browse', {
        queryKeywords,
        topicNames: topicsArr,
        daysAgo,
        data: sortPayload(data, sortQuery)
      })
    })
}
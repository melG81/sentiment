let topics = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let _ = require('lodash')
let {sortPayload} = require('./helpers')
let queryKeywords = require('../src/filters/queryKeywords.js')
let { pollScript } = require('../src/util/api');
let google = require('../src/util/google');

topics.index = function (req, res, next) {
  let page = Number(req.query.page || 1)
  let getNextPage = function(page, data) {
    if (data.length >= 80) {
      return page + 1
    } else {
      return null
    }
  }
  let getPrevPage = function(page){
    if (page === 1) {
      return null
    } else {
      return page - 1
    }
  }
  let prevPage = getPrevPage(page)

  dbClient.getAll(page)
    .then(payload => {
      let data = payload.data;
      let nextPage = getNextPage(page, data)
      res.render('topics/show', {
        topicName: 'all',
        data: sortPayload(data),
        page,
        nextPage,
        prevPage
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

topics.getTopicBrowseURL = function (topicArr, daysAgo) {
  let topicQuery = topicArr.map(topic => encodeURI(topic)).join('&topic=')
  let url = `${config.sentimentDBHost}/topics/browse?topic=${topicQuery}&daysAgo=${daysAgo}`
  return url
}

/**
 * @function {query webhose api -> transform + update db -> fetch from db -> analyze sentiment -> update db for sentiment}
 */
// TODO: NOTE that pollScripte returns a promise of db being created.
// If it isn't created yet then pollSentiment will not be able to query the id and will not update sentiment
// Either rewrite pollScript to not return a promise but wait for db create to finish OR rewrite sentiment to be separate to pollScript runtime
topics.pollscript = function (req, res, next) {
  let payload = req.body
  let query = _.get(payload, 'query')
  let daysAgo = _.get(payload, 'daysAgo')
  pollScript(query, daysAgo)
    .then(() => google.pollSentiment(query, daysAgo))
    .then(results => {
      res.send(results)
    })
}

topics.upVote = function (req, res, next) {
  let id = req.params.id
  dbClient.upVote(id)
    .then(payload => {
      res.send(payload.data)
    })
    .catch(next)
}

topics.downVote = function (req, res, next) {
  let id = req.params.id
  dbClient.downVote(id)
    .then(payload => {
      res.send(payload.data)
    })
    .catch(next)
}

topics.getById = function (req, res, next) {
  let id = req.params.id
  dbClient.getDoc(id)
    .then(payload => {
      res.send(payload.data)
    })
    .catch(next)
}
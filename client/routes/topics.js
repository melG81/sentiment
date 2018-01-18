let topics = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let _ = require('lodash')
let {sortPayload} = require('./helpers')
let queryKeywords = require('../src/filters/queryKeywords.js')
let { pollScript } = require('../src/util/api');
// let google = require('../src/util/google');
let { parseHtml } = require('../src/util/helpers')
let moment = require('moment');

topics.index = function (req, res, next) {
  let page = Number(req.query.page || 1)
  let admin = req.query.admin
  let isAdmin = _.get(req, "user.admin")
  let topic = req.params.name || null
  let sort = req.query.sort
  let getNextPage = function(page, data) {
    if (data.length >= 50) {
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
  
  dbClient.getAll(page, topic)
    .then((payload) => {
      let data = payload.data
      if (sort !== 'latest') {
        data = sortPayload(data)
      }
      let nextPage = getNextPage(page, data)
      res.render('topics/show', {
        topicName: topic,
        data,
        page,
        nextPage,
        prevPage,
        admin,
        sort,
        isAdmin
      })
    });
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
    // .then(() => google.pollSentiment(query, daysAgo))
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

topics.fundamentals = function (req, res, next) {
  dbClient.getByTopics(['fundamentals'], 100)
    .then(payload => {
      let data = payload.data
      res.render('topics/fundamentals', {data})
    })
}

topics.article = function (req, res, next) {
  let id = req.params.id
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  dbClient.getDoc(id)
    .then(payload => {
      let {post, documentSentiment, topic, votes} = payload.data
      let {site, url, author, published, title, text} = post
      res.render('topics/article', {
        layout: 'amp',
        canonUrl: fullUrl,
        post: {
          site,
          url,
          author,
          published,
          title,
          text
        },
        documentSentiment,
        topic: topic[0],
        votes
      })
    })
    .catch(err => {
      console.log(err.message);
    })
}

topics.new = function (req, res, next) {
  res.render('topics/new', { queryKeywords, today: moment().format('YYYY-MM-DDTHH:mm')})
}

topics.create = function (req, res, next) {
  let {site, url, author, published, title, text, topic } = req.body
  let post = { 
    site, 
    url, 
    author, 
    published, 
    title, 
    text, 
    uuid: Math.random().toString(36).substring(7)
  }

  dbClient.postThread(topic, post)
    .then(resp => {
      let data = resp.data
      let id = data._id
      let title = data.title
      let url = `/topics/news/${title}/${id}`
      res.redirect(url)
    })
    .catch(next)
}

topics.delete = function (req, res, next) {
  let id = req.params.id

  dbClient.deleteThread(id)
    .then(resp => {
      let data = resp.data
      res.json(data)
    })
    .catch(next)
}
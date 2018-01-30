// ENV variables
require('dotenv').config({ path: __dirname + '/./../../.env' });

let dbClient = module.exports = {}

// Dependencies
let config = require('../../config.js');
let axios = require('axios');
let _ = require('lodash')

/**
 * @function {makes a POST request to sentiment-db/threads with relevant payload}
 * @param  {String || Array} topicParam {query paramater from api.query search}
 * @param  {Object} posts  {array of parsed posts}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios.post promise}
 */
dbClient.postThread = function (topicParam, post, request=axios) {
  let url = `${config.sentimentDBHost}/threads`
  let topic = _.isString(topicParam) ? topicParam.split() : topicParam

  let thread = {
    topic,
    post
  }
  return request.post(url, thread)
}

dbClient.deleteThread = function (id, request=axios) {
  let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;

  return request.delete(url)
}

/**
 * @function {makes a PUT request to sentiment-db/threads/topic/id with document id and updated document}
 * @param  {String} id       {unique document id}
 * @param  {Object} document {updated document}
 * @param  {Object} request  {request dependency defaults to axios}
 * @return {Promise} {axios.put promise}
 */
dbClient.updateThread = function (id, document, request=axios) {
  let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;
  return request.put(url, document)
}

dbClient.getDoc = function (id, request=axios) {
  let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;
  return request.get(url)
}
/**
 * @function {upvote a document or set as vote: 1 if none exists}
 * @param  {String} id       {unique document id}
 * @param  {Object} request  {request dependency defaults to axios}
 * @return {Promise} {axios.put promise}
 */
dbClient.upVote = function (id, request=axios) {
  return new Promise((resolve) => {
    dbClient.getDoc(id)
    .then(payload => {
      let document = payload.data;
      let hasVotes = document.votes;
      let voteOpts;
      if (hasVotes) {
        voteOpts = {votes: document.votes += 1}
      } else {
        voteOpts = {votes: 1}
      }
      let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;
      resolve(request.put(url, voteOpts))
    })
  })
}

/**
 * @function {downvote a document or set as vote: -1 if none exists}
 * @param  {String} id       {unique document id}
 * @param  {Object} request  {request dependency defaults to axios}
 * @return {Promise} {axios.put promise}
 */
dbClient.downVote = function (id, request=axios) {
  return new Promise((resolve) => {
    dbClient.getDoc(id)
    .then(payload => {
      let document = payload.data
      let hasVotes = document.votes;
      let voteOpts;
      if (hasVotes) {
        voteOpts = {votes: document.votes -= 1}
      } else {
        voteOpts = {votes: -1}
      }
      let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;
      resolve(request.put(url, voteOpts))
    })
  })
}

/**
 * @function {makes a GET request to sentiment-db/threads/topic/query?topic=name&daysAgo=num}
 * @param  {Array} topicArr       {array of topic strings to query}
 * @param  {Number} daysAgo {days since published}
 * @param  {Object} request  {request dependency defaults to axios}
 * @return {Promise} {axios.get promise}
 */
dbClient.getByTopics = function (topicArr, daysAgo, request=axios) {  
  let topicQuery = topicArr.map(topic => encodeURI(topic)).join('&topic=')
  let url = `${config.sentimentDBHost}/threads/topic/query?topic=${topicQuery}&daysAgo=${daysAgo}`
  return request.get(url)
}

/**
 * @function {returns the topic documents from the given sites}
 * @param  {String} topic       {topic you want to search i.e. 'bitcoin'}
 * @param  {Array} sitesArr {array of sites to be filtered i.e. ['wsj.com', 'bloomberg.com']}
 * @param  {Object} request  {request dependency defaults to axios}
 * @return {Promise} {axios.post promise}
 */
dbClient.getByTopicAndSites = function (topic, sitesArr, request=axios) {
  let url = `${config.sentimentDBHost}/threads/sites`;
  return request.post(url,{topic, sites: sitesArr})
}

// TODO: Write unit test
/**
 * @function {fetces all documents}
 * @param  {Object} request  {request dependency defaults to axios}
 * @return {Promise} {axios.get promise}
 */
dbClient.getAll = function (page, topic, request=axios) {
  let topicQuery = topic ? `&topic=${topic}` : "";
  let url = `${config.sentimentDBHost}/threads?page=${page}${topicQuery}`;
  return request.get(url)
}

dbClient.createFavorite = function (userId, threadId, request=axios) {
  let url = `${config.sentimentDBHost}/favorites`;
  let payload = {user: userId, thread: threadId}
  return request.post(url, payload)
} 

dbClient.getUserFavorites = function (userId, request = axios) {
  let url = `${config.sentimentDBHost}/users/${userId}/favorites`;
  return request.get(url)
} 
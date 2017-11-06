// ENV variables
require('dotenv').config({ path: __dirname + '/./../../.env' });

let dbClient = module.exports = {}

// Dependencies
let config = require('../../config.js');
let axios = require('axios');

/**
 * @function {makes a POST request to sentiment-db/threads with relevant payload}
 * @param  {String} topic {query paramater from api.query search}
 * @param  {Object} posts  {array of parsed posts}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios.post promise}
 */
dbClient.postThread = function (topic, post, request=axios) {
  let url = `${config.sentimentDBHost}/threads`;

  let thread = {
    topic: [topic],
    post: post
  }
  return request.post(url, thread)
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

dbClient.upVote = function (id, document, request=axios) {
  let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;
  let hasVotes = document.votes;
  if (hasVotes) {
    document.votes += 1
  } else {
    document.votes = 1
  }
  return request.put(url, document)
}

dbClient.downVote = function (id, document, request=axios) {
  let url = `${config.sentimentDBHost}/threads/topic/id/${id}`;
  let hasVotes = document.votes;
  if (hasVotes) {
    document.votes -= 1
  } else {
    document.votes = -1
  }
  return request.put(url, document)
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
dbClient.getAll = function (request=axios) {
  let url = `${config.sentimentDBHost}/threads`;
  return request.get(url)
}

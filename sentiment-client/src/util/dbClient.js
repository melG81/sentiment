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
dbClient.postThread = function (topic, posts, request=axios) {
  let url = `${config.sentimentDBHost}/threads`;

  let thread = {
    topic,
    posts
  }
  return request.post(url, thread)
}
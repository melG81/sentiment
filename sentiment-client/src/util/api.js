let api = module.exports = {}

// Dependencies
let _ = require('lodash');
let axios = require('axios');
let config = require('../../config.js');
let helpers = require('./helpers');
let parser = require('./parser');
let dbClient = require('./dbClient');

/**
 * @function {Returns webhose url endpoint}
 * Refer to webhose API developer docs for filter and format query params
 * https://docs.webhose.io/v1.0/docs/filters-reference
 * @return {String} {webhose url endpoint}
 */
api.getWebhoseEndpoint = () => {  
  this.token = config.webhoseTOKEN;
  this.endpoint = "http://webhose.io/filterWebContent?token=";
  this.format = "sort=relevancy&size=100";
  this.filters = "q=language%3Aenglish%20site_type%3Anews%20is_first%3Atrue%20";
  return `${this.endpoint}${this.token}&${this.format}&${this.filters}`
}

/**
 * @function {Fetches initial api payload based on query paramater}
 * @param  {String} query {topic you want to search webhouse for e.g. bitcoin or donald trump}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios get promise}
 */
api.query = function (query, request=axios) {
  let endpoint = api.getWebhoseEndpoint();
  let queryParam = encodeURI(query);
  let url = endpoint + queryParam;
  return request.get(url)
}

/**
 * @function {parses payload and makes a POST request to sentiment-db/threads}
 * @param  {String} query {query paramater from api.query search}
 * @param  {Object} payload  {payload data from a single post with multiple threads}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios.post promise}
 */
api.postThread = function (query, payload, request=axios) {
  let posts = _.get(payload, 'data.posts');
  let parsedPosts = parser.parseArray(posts);
  return dbClient.postThread(query, parsedPosts, request)
}

/**
 * @function {Fetches next payload if there are more results available }
 * @param  {Object} payload {returned data from api.query}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {get promise of the next url if more data available, otherwise will resolve with string 'No More results'}
 */
api.getNext = function (payload, request=axios) {
  let data = payload.data;
  let isMore = data.moreResultsAvailable > 0;
  let next = data.next;
  let url = "http://webhose.io" + next;
  if (isMore) {
    return request.get(url)
  } else {
    return Promise.resolve('No more results');
  }
}

/**
 * @function {Recursive function which keeps fetching next payload, parses and posts a thread until there are no more results available}
 * @param  {Object} data {returned data from api.query}
 * @param  {Object} payload {returned data from api get url payload}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {resolves to 'No more results' when no more results are left}
 */
api.pollNext = function (query, payload, request=axios) {    
  // Side task: post payload to database
  api.postThread(query, payload, request);
  
  // Fetches the next payload and calls itself recursively
  return api.getNext(payload, request).then(nextPayload => {
    if (nextPayload === 'No more results') {
      return Promise.resolve(nextPayload)
    }
    return api.pollNext(query, nextPayload, request);
  })
}

/**
 * @function {Queries, parses and posts data from the api until no more results available}
 * @param  {String} query {query paramater}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} resolves to 'No more results' when completed polling
 */
api.pollScript = function (query, request=axios) {
  return new Promise(function(resolve){
    api.query(query, request)
      .then(payload => {
        return api.pollNext(query, payload, request);
      })
      .then(msg => {
        resolve(msg)
      })
  })
}
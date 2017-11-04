let api = module.exports = {}

// Dependencies
let get = require('lodash/get');
let axios = require('axios');

let config = require('../../config.js');
let helpers = require('./helpers');
let parser = require('./parser');
let dbClient = require('./dbClient');
let sitesFiltered = require('../filters/sitesFiltered');

/**
 * @function {Returns webhose url endpoint}
 * Refer to webhose API developer docs for filter and format query params
 * https://docs.webhose.io/v1.0/docs/filters-reference
 * @return {String} {webhose url endpoint}
 */
api.getWebhoseEndpoint = (daysAgo=1) => {
  let token = config.webhoseTOKEN;
  let endpoint = "https://webhose.io/filterWebContent?token=";
  let sort = "sort=relevancy";
  let sinceDate = new Date() - (daysAgo*24*60*60*1000);
  let publishedAfter = `published%3A%3E${sinceDate}`
  let sitesFilter = "(site%3A" + sitesFiltered.join('%20OR%20site%3A') + ")";
  let filters = `q=${publishedAfter}${sitesFilter}language%3Aenglish%20site_type%3Anews%20is_first%3Atrue%20`;
  return `${endpoint}${token}&${sort}&${filters}`
}

/**
 * @function {Fetches initial api payload based on query paramater}
 * @param  {String} query {topic you want to search webhouse for e.g. bitcoin or donald trump}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios get promise}
 */
api.query = function (query, daysAgo, request=axios) {
  let endpoint = api.getWebhoseEndpoint(daysAgo);
  let queryParam = encodeURI(query);
  let url = endpoint + queryParam;
  return request.get(url)
}

/**
 * @function {parses payload and makes a POST request to sentiment-db/threads}
 * @param  {String} topic {query paramater from api.query search}
 * @param  {Object} payload  {payload data from a single post with multiple threads}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios.post promise}
 */
api.postThread = function (topic, payload, request=axios) {
  let posts = get(payload, 'data.posts');
  let parsedPostsArr = parser.parseArray(posts);
  let promiseArr = parsedPostsArr.map(post => {
    return dbClient.postThread(topic, post, request)
  })
  return Promise.all(promiseArr)
}

/**
 * @function {Fetches next payload if there are more results available }
 * @param  {Object} payload {returned data from api.query}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {get promise of the next url if more data available, otherwise will resolve with string 'No More results'}
 */
api.getNext = function (payload, request=axios) {
  let data = payload.data;
  console.log(`totalResults: ${data.totalResults} moreResultsAvailable: ${data.moreResultsAvailable}`);  
  let isMore = data.moreResultsAvailable > 0;
  let next = data.next;
  let url = "http://webhose.io" + next;
  if (isMore) {
    return request.get(url)
  } else {
    return Promise.resolve(`No more results`);
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
    let totalResults = get(payload, 'data.totalResults')
    if (nextPayload === 'No more results') {
      return Promise.resolve(`No more results, totalResults: ${totalResults}`)
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
api.pollScript = function (query, daysAgo, request=axios) {
  return new Promise(function(resolve){
    api.query(query, daysAgo, request)
      .then(payload => {
        return api.pollNext(query, payload, request);
      })
      .then(msg => {
        resolve(msg)
      })
  })
}
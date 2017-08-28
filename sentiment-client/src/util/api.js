let api = module.exports = {}

// Dependencies
let config = require('../../config.js');
let axios = require('axios');
let helpers = require('./helpers');
let parser = require('./parser');

/**
 * {Object literal to store webhose api paramaters, call .buildURL to return endpoint}
 * Refer to webhose API developer docs for filter and format query params
 * https://docs.webhose.io/v1.0/docs/filters-reference
 * @return {String} {webhose url endpoint}
 */
api.webhose = {  
  token: config.webhoseTOKEN,
  endpoint: "http://webhose.io/filterWebContent?token=",
  format: "sort=relevancy&size=100",
  filters: "q=language%3Aenglish%20site_type%3Anews%20is_first%3Atrue%20",
  buildURL: function(){
    return `${this.endpoint}${this.token}&${this.format}&${this.filters}`
  }
}

/**
 * @function {Fetches initial api payload based on query paramater}
 * @param  {String} query {topic you want to search for e.g. bitcoin or donald trump}
 * @return {Promise} {axios get promise}
 */
api.query = function (query) {
  let endpoint = api.webhose.buildURL();
  let queryParam = encodeURI(query);
  let url = endpoint + queryParam;
  return axios.get(url)
}

/**
 * @function {makes a POST request to sentiment-db/threads}
 * @param  {String} query {query paramater from api.query search}
 * @param  {Object} data  {single post payload data}
 * @return {Promise} {axios.post promise}
 */
api.postThread = function (query, parsedPosts) {
  let url = `${config.sentimentDBHost}threads`;
  let thread = {
    topic: query,
    posts: parsedPosts
  }
  return axios.post(url, thread)
}

/**
 * @function {Fetches next payload if there are more results available }
 * @param  {Object} payload {returned data from api.query}
 * @return {Promise} {axios get promise, will throw if there are no more results available}
 */
api.getNext = function (payload) {
  let data = payload.data;
  let isMore = data.moreResultsAvailable > 0;
  let next = data.next;
  let url = "http://webhose.io" + next;
  if (isMore) {
    return axios.get(url)
  } else {
    throw('No more results');
  }
}

/**
 * @function {Recursive function which keeps fetching next payload until there are no more results available}
 * @param  {Object} data {returned data from api.query}
 * @return {Promise} {axios get promise, will continue calling itself until api.getNext throws 'No more results'}
 */
api.pollNext = function (query, payload) {    
  // Side task: parses successful payload and posts to database
  let posts = payload.data.posts;
  let parsedPosts = parser.parseArray(posts);
  api.postThread(query, parsedPosts);
  
  // Fetches the next payload and calls itself recursively
  return api.getNext(payload).then(data => {    
    return api.pollNext(query, data);
  })
}

/**
 * @function {Queries, parses and posts data from the api until no more results available}
 * @param  {String} query {query paramater}
 * @return {Promise}
 */
api.pollScript = function (query) {
  return new Promise(function(resolve){
    api.query(query)
      .then(payload => {
        return api.pollNext(query, payload);
      })
      .catch(msg => {
        resolve(msg)
      })
  })
}
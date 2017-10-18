let parser = module.exports = {};

// Dependencies
let helpers = require('./helpers.js')
let _ = require('lodash')

/**
 * @function {parses single post object to extract relevant metadata }
 * @param  {Object} data {single post from webhose api payload}
 * @return {Object} {transformed object with extracted data}
 */
parser.parsePost = function(data){
  let {url, author, published, title, text, crawled } = data;

  return {
    site: _.get(data, 'thread.site'),
    url, 
    author, 
    published, 
    title, 
    crawled,
    text: helpers.truncate(data.text, 600)
  }
}

/**
 * @function {Parses through an entire array of posts and returns array of updated posts}
 * @param  {Array} array {posts payload in the form of payload.posts}
 * @return {Array} {array of transformed posts}
 */
parser.parseArray = function(array){
  return array.map(post => {
    return parser.parsePost(post);
  })
}
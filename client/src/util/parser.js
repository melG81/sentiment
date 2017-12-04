let parser = module.exports = {};

// Dependencies
let helpers = require('../helpers')
let get = require('lodash/get')

/**
 * @function {parses single post object to extract relevant metadata }
 * @param  {Object} data {single post from webhose api payload}
 * @return {Object} {transformed object with extracted data}
 */
parser.parsePost = function(data){
  let {uuid, url, author, published, title, text, crawled } = data;

  return {
    uuid,
    site: get(data, 'thread.site'),
    url,
    author,
    published,
    title,
    crawled,
    text: helpers.truncate(data.text, 5000),
    domainRank: get(data, 'thread.domain_rank'),
    mainImage: get(data, 'thread.main_image'),
    social: get(data, 'thread.social')
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

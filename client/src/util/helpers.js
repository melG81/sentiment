let helpers = module.exports = {}

// Dependencies
let {parse} = require('query-string');

/**
 * @function {truncates a string based on number of characters provided}
 * @param  {String} string {Sentence to be truncated}
 * @param  {Number} num    {Number of characters to truncate}
 * @return {String} {truncated string}
 */
helpers.truncate = function (string, num) {
  let sliced = string.slice(0, num)
  return `${sliced}...`;
}

/**
 * @function {parses a query string url}
 * @param  {String} string {url string e.g. test.com/search?q=banana&filter=rich}
 * @param  {String} param  {the property you want returned e.g. 'filter'}
 * @return {String} {the relevant parameter}
 */
helpers.parse = function(string, param) {
  return parse(string)[param];
}
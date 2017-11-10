let helpers = module.exports = {}

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

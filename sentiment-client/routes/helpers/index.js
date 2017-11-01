let helpers = module.exports = {};

// Dependencies
let _ = require('lodash')

// TODO: Unit test
/**
 * @function {sorts array payload by unique titles and date published}
 * @param  {Array} array       {array of posts}
 * @param  {String} sortBy  {"descending" otherwise blank will sort ascending}
 * @return {Array} {filtered array of posts}
 */

helpers.sortPayload = (array, sortBy) => {
  // Filter by unique post titles
  let uniqPayload = _.uniqBy(array, 'post.title')
  // Sort by most recent published unless query param includes ?sort=descending
  if (sortBy === 'descending') {
    return uniqPayload.sort((a, b) => new Date(a.post.published) - new Date(b.post.published))
  } else {
    return uniqPayload.sort((a, b) => new Date(b.post.published) - new Date(a.post.published))
  }
}


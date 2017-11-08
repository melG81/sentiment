let helpers = module.exports = {}

// Dependencies
let moment = require('moment')

helpers.capitalize = (word) => {
  return word[0].toUpperCase() + word.substr(1)
}

helpers.moment = (dateString, format) => {
  return moment(dateString).format(format)
}

helpers.join = (array) => {
  return array.join(', ')
}

/**
 * @function {simple iterator helper}
 * @param  {Number} n     {number to iterate up to starting from 1}
 * @param  block {block argument}
 */
helpers.times = (n, block) => {
  let accum = '';
  for (let i = 1; i <= n; ++i)
    accum += block.fn(i);
  return accum;
}
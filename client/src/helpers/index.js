let helpers = module.exports = {}

// Dependencies
let moment = require('moment')
let numeral = require('numeral')

helpers.eq = (a, b) => {
  if (a == b) {
    return true
  } else {
    return false
  }
}

helpers.modulo = (a, b) => {
  if (a % b === 0) {
    return true
  } else {
    return false
  }
}

helpers.capitalize = (word) => {
  return word[0].toUpperCase() + word.substr(1)
}

helpers.moment = (dateString, format) => {
  return moment(dateString).format(format)
}

helpers.momentFromNow = (dateString) => {
  let date = moment(dateString)
  let now = moment()
  return moment.min(date, now).fromNow()
}

helpers.join = (array) => {
  return array.join(', ')
}

helpers.add = (string, num) => {
  return Number(string + num)
}

helpers.round = (string, num) => {
  let number = Number(string)
  let round = Number(num)
  return number.toFixed(round)
}

helpers.sentimentColor = (score) => {
  let num = Number(score)
  if (num < -0.25) {
    return '#E45E5E'
  } else if (num > 0.25) {
    return '#56BC4E'
  } else {
    return '#828282'
  }
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

helpers.numeral = (n, stringFormat) => {
  let num = Number(n)
  return numeral(num).format(stringFormat)
}

helpers.tickerColor = (percentage) => {
  let num = Number(percentage)
  if (num < 0) {
    return '#E45E5E'
  } else {
    return '#56BC4E'
  }
}

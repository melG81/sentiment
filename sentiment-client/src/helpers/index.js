let helpers = module.exports = {}

// Dependencies
let moment = require('moment')

helpers.capitalize = (word) => {
  return word[0].toUpperCase() + word.substr(1)
}

helpers.moment = (dateString, format) => {
  return moment(dateString).format(format)
}
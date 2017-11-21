let moment = require('moment')

module.exports = (dateString, format) => {
  return moment(dateString).format(format)
}

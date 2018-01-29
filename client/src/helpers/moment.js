let format = require('date-fns/format')

module.exports = (dateString, formatString) => {
  return format(dateString, formatString)
}

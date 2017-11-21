let moment = require('moment')

module.exports = (dateString) => {
  let date = moment(dateString)
  let now = moment()
  return moment.min(date, now).fromNow()
}

// Dependencies
let numeral = require('numeral')

module.exports = (n, stringFormat) => {
  let num = Number(n)
  return numeral(num).format(stringFormat)
}

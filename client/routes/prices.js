// Dependencies
let {fetchTickers} = require('../src/prices/coin')

exports.index = (req, res, next) => {
  fetchTickers().then(payload => {
    res.send(payload)
  }).catch(next)
}

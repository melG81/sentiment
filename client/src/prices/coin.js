let coin = module.exports = {}

// Dependencies
let axios = require('axios')
let _ = require('lodash')
let pipe = require('lodash/fp/pipe')

let CMC_PRO_API_KEY_HEADER = {
  'X-CMC_PRO_API_KEY': '15fb1d82-0830-4c4a-b23d-8a154957ce14'
}
let CMC_ENDPOINT_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=30"

// FETCH DATA
let fetchLatestPrices = (request=axios) => {
  return request.get(CMC_ENDPOINT_URL, {headers: CMC_PRO_API_KEY_HEADER})
    .then(resp => resp.data)
}

coin.parseSingleTicker = ({symbol,quote}) => (
  Object.assign({}, {
    ticker: symbol,
    currency: "USD",
    price: Number(quote["USD"]["price"]),
    mktcap: Number(quote["USD"]["market_cap"]),
    changePctDay: Number(quote["USD"]["percent_change_24h"]) / 100,
    changePctWeek: Number(quote["USD"]["percent_change_7d"]) / 100
  })
)

coin.parseTickers = pipe(
  _.partialRight(_.map, coin.parseSingleTicker),
  _.partialRight(_.orderBy, 'desc', 'mktcap')
)

coin.fetchTickers = (request=axios) => 
  fetchLatestPrices(request)
    .then(resp=> coin.parseTickers(resp.data))

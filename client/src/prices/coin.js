let coin = module.exports = {}

// Dependencies
let axios = require('axios')
let _ = require('lodash')
let pipe = require('lodash/fp/pipe')

let getURL = url => (request=axios) => {
  return request.get(url).then(resp => resp.data)
}

let getPrices = getURL("https://api.coinmarketcap.com/v1/ticker/?limit=30")

coin.parseSingleTicker = ({symbol,price_usd,market_cap_usd,percent_change_24h,percent_change_7d}) => (
  Object.assign({}, {
    ticker: symbol,
    currency: "USD",
    price: Number(price_usd),
    mktcap: Number(market_cap_usd),
    changePctDay: Number(percent_change_24h) / 100,
    changePctWeek: Number(percent_change_7d) / 100
  })
)

coin.parseTickers = pipe(
  _.partialRight(_.map, coin.parseSingleTicker),
  _.partialRight(_.orderBy, 'desc', 'mktcap')
)

coin.fetchTickers = (request=axios) => 
  getPrices(request)
    .then(coin.parseTickers)
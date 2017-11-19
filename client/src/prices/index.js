let prices = module.exports = {}

// Dependencies
let get = require('lodash/get');
let axios = require('axios');
let values = require('lodash/values');

/**
 * @function {Returns cryptocompare url endpoint for fetching multiple ticker prices}
 * @param  {Array} tickerArr {array of cryptocurrency ticker strings e.g. ['BTC', 'ETH']
 * @param  {String} currency {currency for the crpyotcurrencies to be expressed in defaults to USD}
 * Refer to cryptocompare API developer docs for more param information
 * https://www.cryptocompare.com/api/#-api-data-price-
 * @return {String} {cryptocompare url endpoint}
 */
prices.getPricesEndpoint = (tickerArr, currency="USD") => {
  let tickers = tickerArr.join(',')
  let tsyms = `tsyms=${currency}`
  let fsyms = `fsyms=${tickers}`
  let endpoint = "https://min-api.cryptocompare.com/data/pricemultifull";
  return `${endpoint}?${tsyms}&${fsyms}`
}

/**
 * @function {Fetches latest price and market cap of multiple cryptocurrency tickers}
 * @param  {Array} tickerArr {array of cryptocurrency ticker strings e.g. ['BTC', 'ETH']
 * @param  {String} currency {currency for the crpyotcurrencies to be expressed in defaults to USD}
 * @param  {Object} request {request dependency defaults to axios}
 * @return {Promise} {axios get promise}
 */
prices.getPrices = (tickerArr, currency="USD", request = axios) => {
  let url = prices.getPricesEndpoint(tickerArr, currency)
  return request.get(url)
}

/**
 * @function {transforms a nested ticker object with relevant properties }
 * @param  {Object} obj {{USD: PRICE: 123, FROMSYMBOL: 'BTC', TOSYMBOL: 'USD', MKTCAP: 100, CHANGEPCTDAY: 0.2}}
 * @return {Object} {transformed ticker object}
 */
prices.parseSingleTicker = (obj) => {
  let nestedObj = obj[Object.keys(obj)[0]]
  let { FROMSYMBOL, TOSYMBOL, PRICE, MKTCAP, CHANGEPCTDAY } = nestedObj
  return {
    ticker: FROMSYMBOL,
    currency: TOSYMBOL,
    price: PRICE,
    mktcap: MKTCAP,
    changePctDay: Number(CHANGEPCTDAY) / 100
  }
}

/**
 * @function {transforms raw payload into array of transformed tickers sorted by mktcap}
 * @param  {Object} data {{RAW: {USD: {}, USD: {}} DISPLAY: {}}}
 * @return {Array} {[{ticker: 'BTC', price: 60000}, {ticker: 'ETH', price: 3000}]}
 */
prices.parseTickers = (data) => {
  let raw = data.RAW
  let rawArr = values(raw)
  let transformed = rawArr.map(ticker => prices.parseSingleTicker(ticker))
  let transformedSorted = transformed.sort((a,b) => b.mktcap - a.mktcap)
  return transformedSorted
}

prices.fetchTickers = (tickerArr, currency="USD", request=axios) => {
  return new Promise((resolve, reject) => {
    prices.getPrices(tickerArr, "USD", request)
    .then(payload => {
      let data = payload.data      
      let result = prices.parseTickers(data)
      resolve(result)
    })
    .catch(err => {
      reject(err)
    })
  })
}
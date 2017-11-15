let prices = module.exports = {}

// Dependencies
let get = require('lodash/get');
let axios = require('axios');
let config = require('../../config.js');

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

prices.parseTicker = (obj) => {
  let nestedObj = obj[Object.keys(obj)[0]]
  let { FROMSYMBOL, TOSYMBOL, PRICE, MKTCAP, CHANGEPCTDAY } = nestedObj
  return {
    ticker: FROMSYMBOL,
    currency: TOSYMBOL,
    price: PRICE,
    mktcap: MKTCAP,
    changePctDay: CHANGEPCTDAY
  }
}

// /**
//  * @function {parses single post object to extract relevant metadata }
//  * @param  {Object} data {single post from webhose api payload}
//  * @return {Object} {transformed object with extracted data}
//  */
// parser.parsePost = function (data) {
//   let { uuid, url, author, published, title, text, crawled } = data;

//   return {
//     uuid,
//     site: get(data, 'thread.site'),
//     url,
//     author,
//     published,
//     title,
//     crawled,
//     text: helpers.truncate(data.text, 5000),
//     domainRank: get(data, 'thread.domain_rank'),
//     mainImage: get(data, 'thread.main_image'),
//     social: get(data, 'thread.social')
//   }
// }

// /**
//  * @function {Parses through an entire array of posts and returns array of updated posts}
//  * @param  {Array} array {posts payload in the form of payload.posts}
//  * @return {Array} {array of transformed posts}
//  */
// parser.parseArray = function (array) {
//   return array.map(post => {
//     return parser.parsePost(post);
//   })
// }




// Dependencies
let { fetchTickers } = require('../../src/prices')
let tickerArr = require('../../src/filters/tickers.js')

var template = require('./template.hbs')

let makeTickerPrices = function () {
  this.init = () => {
    let $tickerPrices = $('#ticker-prices')
    fetchTickers(tickerArr).then(prices => {
      var html = template({ tickers: prices })
      $tickerPrices.html(html)      
    })
  }
}

let tickerPrices = new makeTickerPrices()
module.exports = tickerPrices
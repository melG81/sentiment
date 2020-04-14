// Dependencies
let axios = require('axios')

var template = require('./template.hbs')

let makeTickerPrices = function () {
  this.init = () => {
    let $tickerPrices = $('#ticker-prices')
    axios.get('https://cryptonewsagency.com/prices').then(resp => {
      let prices = resp.data
      var html = template({
        tickers: prices
      })
      $tickerPrices.html(html)
    })
  }
}


let tickerPrices = new makeTickerPrices()
module.exports = tickerPrices
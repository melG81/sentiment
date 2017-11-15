// Dependencies
let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');
let _ = require('lodash')

// Modules and test data
let prices = require('../../../src/prices');
let priceMultiData = require('../../data/prices/priceMulti.json');
let priceMultiParsed = require('../../data/prices/priceMultiParsed')

describe.only('#prices', () => {
  describe('.getPricesEndpoint', () => {
    let tickerArr = ["BTC", "ETH", "BCH", "XRP", "LTC", "DASH", "NEO", "XMR", "NEM", "ETC", "MIOTA", "QTUM", "LSK", "ZEC", "ADA", "HSR", "XLM", "BCC", "WAVES", "STRAT"]

    it('should transform an array of tickers to the full API get endpoint with default USD equivalent', () => {
      let input = prices.getPricesEndpoint(tickerArr)
      let actual = "https://min-api.cryptocompare.com/data/pricemultifull?tsyms=USD&fsyms=BTC,ETH,BCH,XRP,LTC,DASH,NEO,XMR,NEM,ETC,MIOTA,QTUM,LSK,ZEC,ADA,HSR,XLM,BCC,WAVES,STRAT"
      expect(input).to.equal(actual)
    })

    it('should filter for currency equivalent if given', () => {
      let input = prices.getPricesEndpoint(tickerArr, 'AUD')
      let actual = "https://min-api.cryptocompare.com/data/pricemultifull?tsyms=AUD&fsyms=BTC,ETH,BCH,XRP,LTC,DASH,NEO,XMR,NEM,ETC,MIOTA,QTUM,LSK,ZEC,ADA,HSR,XLM,BCC,WAVES,STRAT"
      expect(input).to.equal(actual)
    })
  })
  describe('.getPrices', () => {
    let axiosStub = {
      get: function(){
        return Promise.resolve({data: priceMultiData})
      }
    }
    it('should return a promise of given cryptocurrency results', (done) => {
      let tickerArr = ["BTC", "ETH", "BCH", "XRP", "LTC", "DASH", "NEO", "XMR", "NEM", "ETC", "MIOTA", "QTUM", "LSK", "ZEC", "ADA", "HSR", "XLM", "BCC", "WAVES", "STRAT"]
      prices.getPrices(tickerArr, "USD", axiosStub)
        .then(payload => {
          let input = payload.data
          let actual = priceMultiData
          expect(input).to.eql(actual)
          done()
        })
    })
  })
  describe('.parseSingleTicker', () => {
    it('should return relevant fields from a ticker', () => {
      let BTC = priceMultiData.RAW.BTC;
      let input = prices.parseSingleTicker(BTC)
      let actual = {
        ticker: 'BTC',
        currency: 'USD',
        price: 6562.47,
        mktcap: 109460437732.14,
        changePctDay: 0.613573120529869
      }
      expect(input).to.eql(actual)
    })
  })
  describe('.parseTickers', () => {
    it('should transform the payload to an array of parsed tickers sorted by marketcap', () => {
      let data = priceMultiData
      let input = prices.parseTickers(data)
      let actual = priceMultiParsed
      expect(input).to.eql(actual)
    })
  })
  describe('.fetchTickers', () => {
    it('should fetch and transform tickers', (done) => {
      let axiosStub = {
        get: function () {
          return Promise.resolve({ data: priceMultiData })
        }
      }
      let actual = priceMultiParsed
      let tickerArr = ["BTC", "ETH", "BCH", "XRP", "LTC", "DASH", "NEO", "XMR", "NEM", "ETC", "MIOTA", "QTUM", "LSK", "ZEC", "ADA", "HSR", "XLM", "BCC", "WAVES", "STRAT"]
      prices.fetchTickers(tickerArr, "USD", axiosStub)
        .then(result => {
          let input = result
          expect(input).to.eql(actual)
          done()
        })
    })
  })
})
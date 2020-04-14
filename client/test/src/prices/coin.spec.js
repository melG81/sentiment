// Dependencies
let chai = require('chai');
let expect = chai.expect;
let _ = require('lodash')

// Modules and test data
let coin = require('../../../src/prices/coin');
let priceMultiData = require('../../data/prices/coinmarketcap/ticker.json');
let priceMultiParsed = require('../../data/prices/coinmarketcap/tickerParsed')

describe('#coin', () => {
  describe('.parseSingleTicker', () => {
    it('should return relevant fields from a ticker', () => {
      let BTC = priceMultiData[0];
      let input = coin.parseSingleTicker(BTC)
      let actual = {
        ticker: 'BTC',
        currency: 'USD',
        price: 6804.69489032,
        mktcap: 124688460239.70108,
        changePctDay: 0.0135184,
        changePctWeek: -0.0725296
      }
      expect(input).to.eql(actual)
    })
  })
  describe('.parseTickers', () => {
    it('should transform the payload to an array of parsed tickers sorted by marketcap', () => {
      let data = priceMultiData
      let input = coin.parseTickers(data)
      let actual = priceMultiParsed
      expect(input).to.eql(actual)
    })
  })
  describe('.fetchTickers', () => {
    it('should fetch and transform tickers', (done) => {
      let requestStub = {
        get: function () {
          return Promise.resolve({ data: {data:priceMultiData} })
        }
      }
      coin.fetchTickers(requestStub)
        .then(result => {
          let input = result
          let actual = priceMultiParsed
          expect(input).to.eql(actual)
          done()
        })
    })
    it('should catch and throw errors', (done) => {
      let requestStub = {
        get: function(){
          return Promise.reject('error')
        }
      }

      coin.fetchTickers(requestStub)
        .catch(err => {
          let input = err
          let actual = 'error'
          expect(input).to.eql(actual)
          done()
        })
    })
  })
})



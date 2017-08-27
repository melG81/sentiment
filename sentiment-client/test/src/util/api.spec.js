var chai = require('chai');
var expect = chai.expect;
var api = require('../../../src/util/api');
var axios = require('axios');
let sinon = require('sinon');

// Require sample json data
let bitcoinPage1 = require('../../data/bitcoinPage1.json');
let bitcoinPage2 = require('../../data/bitcoinPage2.json');
let bitcoinPage3 = require('../../data/bitcoinPage3.json');

describe.only('api', function () {
  it('should exist', () => expect(api).to.not.be.undefined);
  describe('query', function () {
    it('should exist', () => expect(api.query).to.not.be.undefined);
    it('should return a payload from api when given a valid query', function(done){
      let payload = {
        data: bitcoinPage1
      }
      let stub = sinon.stub(axios, 'get').returns(Promise.resolve(payload));
      api.query('bitcoin')
        .then(data => {
          expect(data).to.eql(payload)
          stub.restore();
          done();
        })
    })
  });
  describe('getNext', function(){
    it('should exist', () => expect(api.getNext).to.not.be.undefined);
    it('should fetch the next URL if there are still more results available', function(done){
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      let stub = sinon.stub(axios, 'get');
      stub.onFirstCall().returns(Promise.resolve(payload1));
      stub.onSecondCall().returns(Promise.resolve(payload2));
      api.query('bitcoin')
        .then(data => {
          expect(data).to.eql(payload1)
          return data
        })
        .then(data => api.getNext(data))
        .then(data => {
          expect(data).to.eql(payload2)
          stub.restore();
          done();
        })
    })
  })
});
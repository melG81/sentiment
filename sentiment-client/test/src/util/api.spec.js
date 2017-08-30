var chai = require('chai');
var expect = chai.expect;
var api = require('../../../src/util/api');
// var axios = require('axios');
let sinon = require('sinon');

// Require sample json data
let bitcoinPage1 = require('../../data/bitcoinPage1.json');
let bitcoinPage2 = require('../../data/bitcoinPage2.json');
let bitcoinPage3 = require('../../data/bitcoinPage3.json');
let bitcoinPage1Parsed = require('../../data/bitcoinPage1Parsed.json');

// Stub functions
let axios = {
  get: sinon.stub(),
  post: sinon.stub()
}

describe('api', function () {
  it('should exist', () => expect(api).to.not.be.undefined);
  describe('query', function () {
    it('should exist', () => expect(api.query).to.not.be.undefined);
    it('should return a payload from api when given a valid query', function(done){
      let payload = {
        data: bitcoinPage1
      }
      axios.get.returns(Promise.resolve(payload));
      api.query(axios, 'bitcoin')
        .then(data => {
          expect(data).to.eql(payload)
          axios.get.reset();
          done();
        })
    })
  });
  describe('getNext', function(){
    it('should exist', () => expect(api.getNext).to.not.be.undefined);
    it('should fetch the next URL if there are still more results available', function(done){
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      axios.get.onFirstCall().returns(Promise.resolve(payload1));
      axios.get.onSecondCall().returns(Promise.resolve(payload2));
      api.query(axios, 'bitcoin')
        .then(data => {
          expect(data).to.eql(payload1)
          return data
        })
        .then(data => api.getNext(axios, data))
        .then(data => {
          expect(data).to.eql(payload2);
          axios.get.reset();
          done();
        })
    });
    it('should keep fetching the next URL until there are no more results available', function(done){
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      let payload3 = { data: bitcoinPage3 }
      axios.get.onFirstCall().returns(Promise.resolve(payload1));
      axios.get.onSecondCall().returns(Promise.resolve(payload2));
      axios.get.onThirdCall().returns(Promise.resolve(payload3));

      api.query(axios, 'bitcoin')
        .then(data => {
          expect(data).to.eql(payload1)
          return data
        })
        .then(data => api.getNext(axios, data))
        .then(data => {
          expect(data).to.eql(payload2)
          return data
        })
        .then(data => api.getNext(axios, data))
        .then(data => {
          expect(data).to.eql(payload3)
          return data;
        })
        .then(data => api.getNext(axios, data))
        .catch(err => {
          let input = err;
          let actual = 'No more results';
          expect(input).to.equal(actual);
          axios.get.reset();
          done();
        })      
    })
  });
  describe('postThread', function() {
    it('should exist', () => expect(api.postThread).to.not.be.undefined);
    it('should send a /POST request to sentiment-db and return the saved payload', function(done){
      let posts = bitcoinPage1Parsed;       
      let postNew = Object.assign({}, {
        topic: 'bitcoin',
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: 'uid',
        posts: posts
      })
      
      axios.post.returns(Promise.resolve(postNew))
      api.postThread(axios, 'bitcoin', posts)
        .then(data => {
          expect(data).to.eql(postNew);
          axios.post.reset();
          done();
        })
    })
  });
  describe('pollScript', function () {
    it('should exist', () => expect(api.pollScript).to.not.be.undefined);
    it('should continue fetching next payload until there are no more results available', function (done) {
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      let payload3 = { data: bitcoinPage3 }
      let spy = sinon.spy(api, 'pollNext');
      axios.get.onFirstCall().returns(Promise.resolve(payload1));
      axios.get.onSecondCall().returns(Promise.resolve(payload2));
      axios.get.onThirdCall().returns(Promise.resolve(payload3));

      api.pollScript(axios, 'bitcoin')
        .then(msg => {
          let input = msg;
          let actual = 'No more results';
          expect(input).to.equal(actual);
          expect(axios.get.callCount).to.equal(3);
          expect(axios.post.callCount).to.equal(3);
          expect(spy.callCount).to.equal(3);
          spy.restore();
          axios.get.reset();
          done();
        })
    })
  });  
});


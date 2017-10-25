var chai = require('chai');
var expect = chai.expect;
var api = require('../../../src/util/api');
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

describe('#api', function () {
  it('should exist', () => expect(api).to.not.be.undefined);
  describe('query', function () {
    it('should exist', () => expect(api.query).to.not.be.undefined);
    it('should return a payload from api when given a valid query', function(done){
      let payload = {
        data: bitcoinPage1
      }
      axios.get.returns(Promise.resolve(payload));
      api.query('bitcoin', axios)
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
      api.query('bitcoin', axios)
        .then(data => {
          expect(data).to.eql(payload1)
          return data
        })
        .then(data => api.getNext(data, axios))
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

      api.query('bitcoin', axios)
        .then(data => {
          expect(data).to.eql(payload1)
          return api.getNext(data, axios)
        })
        .then(data => {
          expect(data).to.eql(payload2)
          return api.getNext(data, axios)
        })
        .then(data => {
          expect(data).to.eql(payload3)
          return api.getNext(data, axios)
        })
        .then(data => {
          expect(data).to.equal('No more results');
          axios.get.reset();
          done();
        })      
    })
  });
  describe('postThread', function() {
    it('should exist', () => expect(api.postThread).to.not.be.undefined);
    it('should send a /POST request to sentiment-db and returns an array of promises', function(done){
      let payload = { data: bitcoinPage1 };
      let postParsed = bitcoinPage1Parsed[0];
      let postNew = {
        topic: ['bitcoin'],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: 'uid',
        post: postParsed
      }
      
      axios.post.returns(Promise.resolve(postNew))
      api.postThread('bitcoin', payload, axios)
        .then(data => {
          expect(data.length).to.equal(100)
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

      let numPosts = bitcoinPage1.posts.length + bitcoinPage2.posts.length + bitcoinPage3.posts.length

      api.pollScript('bitcoin', axios)
        .then(msg => {
          expect(msg).to.equal('No more results');
          expect(axios.get.callCount).to.equal(3);
          expect(axios.post.callCount).to.equal(numPosts);
          expect(spy.callCount).to.equal(3);
          spy.restore();
          axios.get.reset();
          done();
        })
    })
  });  
});


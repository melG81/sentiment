var chai = require('chai');
var expect = chai.expect;
var api = require('../../../src/util/api');
let sinon = require('sinon');

// Require sample json data
let bitcoinPage1 = require('../../data/bitcoinPage1.json');
let bitcoinPage2 = require('../../data/bitcoinPage2.json');
let bitcoinPage3 = require('../../data/bitcoinPage3.json');
let bitcoinDiscussion = require('../../data/bitcoinDiscussion.json');
let bitcoinPage1Parsed = require('../../data/bitcoinPage1Parsed.json');
let sitesFilteredDiscussion = require('../../../src/filters/sitesFilteredDiscussion');

// Stub functions
let axios = {
  get: sinon.stub(),
  post: sinon.stub()
}

describe('#api', function () {
  it('should exist', () => expect(api).to.not.be.undefined);
  describe('getWebhoseEndpointDiscussion', () => {
    it('should return the webhose endpoint for querying', () => {
      let daysAgo = 1
      let input = api.getWebhoseEndpointDiscussion(daysAgo)
      let sinceDate = new Date() - (daysAgo * 24 * 60 * 60 * 1000)
      let publishedAfter = `published%3A%3E${sinceDate}`
      let sitesFilter = "(site%3A" + sitesFilteredDiscussion.join('%20OR%20site%3A') + ")";
      let actual = `https://webhose.io/filterWebContent?token=da347ad6-b6b4-4135-839d-4308c3989db4&sort=replies_count&q=${publishedAfter}${sitesFilter}replies_count%3A%3E10%20language%3Aenglish%20site_type%3Adiscussions%20is_first%3Atrue%20`
      expect(input).to.equal(actual)
    })
  })
  describe('query', function () {
    it('should exist', () => expect(api.query).to.not.be.undefined);
    it('should return a payload from api when given a valid query', function(done){
      let getWebhoseEndpointDiscussionSpy = sinon.spy(api, 'getWebhoseEndpointDiscussion')
      let getWebhoseEndpointSpy = sinon.spy(api, 'getWebhoseEndpoint')
      let payload = {
        data: bitcoinPage1
      }
      axios.get.returns(Promise.resolve(payload));
      api.query('bitcoin', 1, 'news', axios)
        .then(data => {
          expect(data).to.eql(payload)
          expect(getWebhoseEndpointSpy.callCount).to.equal(1);
          expect(getWebhoseEndpointDiscussionSpy.callCount).to.equal(0);
          axios.get.reset();
          getWebhoseEndpointSpy.restore();
          getWebhoseEndpointDiscussionSpy.restore();
          done();
        })
    })
    it('should call the discussion endpoint if the topic is discussion', function(done){
      let getWebhoseEndpointDiscussionSpy = sinon.spy(api, 'getWebhoseEndpointDiscussion')
      let getWebhoseEndpointSpy = sinon.spy(api, 'getWebhoseEndpoint')
      let payload = {
        data: bitcoinDiscussion
      }
      axios.get.returns(Promise.resolve(payload));
      api.query('bitcoin', 1, 'discussion', axios)
        .then(data => {
          expect(data).to.eql(payload)
          expect(getWebhoseEndpointSpy.callCount).to.equal(0);
          expect(getWebhoseEndpointDiscussionSpy.callCount).to.equal(1);
          axios.get.reset();
          getWebhoseEndpointSpy.restore();
          getWebhoseEndpointDiscussionSpy.restore();
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
      api.query('bitcoin', 1, 'news', axios)
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

      api.query('bitcoin',1, 'news', axios)
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

      api.pollScript('bitcoin', 1, 'news', axios)
        .then(msg => {
          expect(msg).to.equal('No more results, totalResults: 2101');
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


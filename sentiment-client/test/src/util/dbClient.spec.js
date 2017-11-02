var chai = require('chai');
var expect = chai.expect;
var dbClient = require('../../../src/util/dbClient');
let sinon = require('sinon');

let config = require('../../../config.js');

// Require sample json data
let bitcoinPage1Parsed = require('../../data/bitcoinPage1Parsed.json');

let axiosStub = {
  get: sinon.stub(),
  post: sinon.stub(),
  put: sinon.stub()
}

describe('#dbClient', () => {
  describe('.postThread', () => {
    it('should send a post request to sentiment-db with payload', (done) => {
      let topic = 'bitcoin'
      let post = bitcoinPage1Parsed[0];
      let postNew = {
        topic: [topic],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: 'uid',
        post
      }

      axiosStub.post.returns(Promise.resolve(postNew))

      dbClient.postThread(topic, post, axiosStub)
        .then(data => {
          let url = config.sentimentDBHost + '/threads'
          let thread = {
            topic: [topic],
            post
          }
          expect(axiosStub.post.calledWith(url, thread)).to.be.true
          expect(data).to.eql(postNew);
          axiosStub.post.reset();
          done();
        })
    })
  })
  describe('.updateThread', () => {
    it('should send a PUT request to sentiment-db with payload', (done) => {
      let id = 'uid'
      let topic = 'miaow'
      let post = {uuid: 'uuid', title: 'cat hero', text: 'cat description'};
      let document = {
        topic: [topic],
        post
      }
      let postNew = {
        topic: [topic],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: id,
        post
      }

      axiosStub.put.returns(Promise.resolve(postNew))

      dbClient.updateThread(id, document, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/topic/id/${id}`
          expect(axiosStub.put.calledWith(url, document)).to.be.true
          expect(data).to.eql(postNew);
          axiosStub.put.reset();
          done();
        })
    })
  })
  describe('.getByTopicAndSites', () => {
    it('should send a POST request to sentiment-db with payload', (done) => {
      let topic = 'bitcoin'
      let sitesArr = ['wsj.com', 'bloomberg.com']
      let postNew = {
        data: [{
          topic: [topic],
          createdAt: new Date(),
          updatedAt: new Date(),
          post: {
            site: 'wsj.com'
          }
        }]
      }

      axiosStub.post.returns(Promise.resolve(postNew))

      dbClient.getByTopicAndSites(topic, sitesArr, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/sites`
          expect(axiosStub.post.calledWith(url)).to.be.true
          expect(data).to.eql(postNew);
          axiosStub.post.reset();
          done();
        })
    })
  })
  describe('.getByTopics', () => {
    it.only('should send a GET request to sentiment-db', (done) => {
      let topicsArr = ['bitcoin currency', 'monero gold']
      let daysAgo = 10
      let posts = {
        data: [{
          topic: topicsArr,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: {
            site: 'wsj.com'
          }
        }]
      }

      axiosStub.get.returns(Promise.resolve(posts))

      dbClient.getByTopics(topicsArr, daysAgo, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/topic/query?topic=bitcoin%20currency&topic=monero%20gold&daysAgo=10`
          expect(axiosStub.get.calledWith(url)).to.be.true
          expect(data).to.eql(posts);
          axiosStub.get.reset();
          done();
        })
    })
  })
})
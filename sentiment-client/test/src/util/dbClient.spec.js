var chai = require('chai');
var expect = chai.expect;
var dbClient = require('../../../src/util/dbClient');
let sinon = require('sinon');

let config = require('../../../config.js');

// Require sample json data
let bitcoinPage1Parsed = require('../../data/bitcoinPage1Parsed.json');

let axiosStub = {
  post: sinon.stub(),
  put: sinon.stub()  
}

describe('#dbClient', () => {
  describe('.postThread', () => {
    it('should send a post request to sentiment-db with payload', (done) => {
      let topic = 'bitcoin'
      let posts = bitcoinPage1Parsed;
      let postNew = Object.assign({}, {
        topic,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: 'uid',
        posts
      })

      axiosStub.post.returns(Promise.resolve(postNew))
      
      dbClient.postThread(topic, posts, axiosStub)
        .then(data => {
          let url = config.sentimentDBHost + '/threads'
          let thread = {
            topic,
            posts
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
      let posts = [{title: 'cat hero'}, {title: 'cat attack'}];
      let document = {
        topic,
        posts
      }
      let postNew = Object.assign({}, {
        topic,
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: id,
        posts
      })

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
})
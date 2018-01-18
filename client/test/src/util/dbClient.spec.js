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
  put: sinon.stub(),
  delete: sinon.stub()
}

describe('#dbClient', () => {
  describe('.postThread', () => {
    it('should send a post request to sentiment-db with payload', (done) => {
      let topic = ['bitcoin']
      let post = bitcoinPage1Parsed[0];
      let postNew = {
        topic,
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
            topic,
            post
          }
          expect(axiosStub.post.calledWith(url, thread)).to.be.true
          expect(data).to.eql(postNew);
          axiosStub.post.reset();
          done();
        })
    })
  })
  describe('.deleteThread', () => {
    it('should send a delete request to sentiment-db with given id', (done) => {
      let id = '123456'

      axiosStub.delete.returns(Promise.resolve('ok'))

      dbClient.deleteThread(id, axiosStub)
        .then(data => {
          let url = config.sentimentDBHost + `/threads/topic/id/${id}`
          expect(axiosStub.delete.calledWith(url)).to.be.true
          axiosStub.delete.reset();
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

  describe('.upVote', () => {
    let id = 'uid'
    let topic = 'miaow'
    let post = {uuid: 'uuid', title: 'cat hero', text: 'cat description'};

    it('should send a PUT request with vote 1 if no vote exists to sentiment-db', (done) => {
      let document = {data:{
        topic: [topic],
        post
      }}
      let postNew = {
        topic: [topic],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: id,
        post,
        votes: 1
      }

      let dbClientStub = sinon.stub(dbClient, 'getDoc').returns(Promise.resolve(document))
      axiosStub.put.returns(Promise.resolve(postNew))

      dbClient.upVote(id, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/topic/id/${id}`
          expect(axiosStub.put.args[0]).to.eql([url, {votes: 1}])
          dbClient.getDoc.restore();
          axiosStub.put.reset();
          done();
        })
    })
    it('should send a PUT request with of vote +1 if vote exists to sentiment-db', (done) => {
      let document = {
        data:{
          topic: [topic],
          post,
          votes: 4
        }
      }
      let postNew = {
        topic: [topic],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: id,
        post,
        votes: 5
      }

      let dbClientStub = sinon.stub(dbClient, 'getDoc').returns(Promise.resolve(document))
      axiosStub.put.returns(Promise.resolve(postNew))

      dbClient.upVote(id, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/topic/id/${id}`
          expect(axiosStub.put.args[0]).to.eql([url, {votes: 5}])
          expect(data).to.eql(postNew);
          dbClient.getDoc.restore()
          axiosStub.put.reset();
          done();
        })
    })
  })

  describe('.downVote', () => {
    let id = 'uid'
    let topic = 'miaow'
    let post = {uuid: 'uuid', title: 'cat hero', text: 'cat description'};

    it('should send a PUT request with vote -1 if no vote exists to sentiment-db', (done) => {
      let document = {data:{
        topic: [topic],
        post
      }
}
      let postNew = {
        topic: [topic],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: id,
        post,
        votes: -1
      }

      let dbClientStub = sinon.stub(dbClient, 'getDoc').returns(Promise.resolve(document))
      axiosStub.put.returns(Promise.resolve(postNew))

      dbClient.downVote(id, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/topic/id/${id}`
          expect(axiosStub.put.args[0]).to.eql([url, {votes: -1}])
          expect(data).to.eql(postNew);
          dbClient.getDoc.restore()
          axiosStub.put.reset();
          done();
        })
    })
    it('should send a PUT request with of vote -1 if vote exists to sentiment-db', (done) => {
      let document = {data:{
        topic: [topic],
        post,
        votes: 4
      }}

      let postNew = {
        topic: [topic],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: id,
        post,
        votes: 3
      }

      let dbClientStub = sinon.stub(dbClient, 'getDoc').returns(Promise.resolve(document))
      axiosStub.put.returns(Promise.resolve(postNew))

      dbClient.downVote(id, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/threads/topic/id/${id}`
          expect(axiosStub.put.args[0]).to.eql([url, {votes: 3}])
          expect(data).to.eql(postNew);
          dbClient.getDoc.restore()
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
    it('should send a GET request to sentiment-db', (done) => {
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
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
    it('should send a PUT request with vote +1 if vote exists to sentiment-db', (done) => {
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

  describe('.createFavorite', () => {
    it('should send a POST request to sentiment-db with userId and threadId payload', (done) => {
      let userId = '5a6fdd8796616cb174d746e3'
      let threadId = '5a6fdd8796616cb174d746e6'
      let favNew = {
        data: {
          __v: 0,
          updatedAt: '2018-01-30T02:50:47.462Z',
          createdAt: '2018-01-30T02:50:47.462Z',
          user: userId,
          thread: threadId,
          _id: '5a6fdd8796616cb174d746e9'
        }
      }

      axiosStub.post.returns(Promise.resolve(favNew))

      dbClient.createFavorite(userId, threadId, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/favorites`
          expect(axiosStub.post.args[0]).to.eql([url, { user: userId, thread: threadId }])
          expect(data).to.eql(favNew);
          axiosStub.post.reset();
          done();
        })
    })
  })

  describe('.getUserFavorites', () => {
    it('should send a GET request to sentiment-db to url /users/:id/favorites', (done) => {
      let userId = '5a6fdd8796616cb174d746e3'
      let favArr = {
        data: [{
          _id: '5a6fe042aae7deb407d9f381',
          updatedAt: '2018-01-30T03:02:26.884Z',
          createdAt: '2018-01-30T03:02:26.884Z',
          post:
            {
              uuid: '8556775c5250a986161955a767be68cc099643d8',
              site: 'businessinsider.com',
              url: 'http://omgili.com/ri/jHIAmI4hxg8v3BmVd24meuL1ei1Bo_4WrVcnnQA4rPU43VUr.1EFLsENOYNWqEvk5MVa7jmgM_OhhMLDLxgyaU7BC11G.3OGANlGoyIde1C5c9x5Jrbk6TU0UUbeiHWR',
              author: 'Frank Chaparro',
              published: '2017-08-24T23:34:00.000+03:00',
              title: 'Bitcoin miners are making a killing in transaction fees',
              crawled: '2017-08-24T23:43:19.010+03:00',
              text: 'August 24, 2017 at 16:34 PM EDT Bitcoin miners are making a killing in transaction fees \nThomson Reuters \nBitcoin miners are making money hand-over-fist. \nAccordingto data from blockchain.info.com , the value of transaction fees paid to miners has reached an all-time high of $2.3 million. \nMiners are basically the hamsters in the wheel that keep bitcoin\'s network going. They use rigs of computers to unlock the blocks (underpinning bitcoin\'s network) on which transactions are made. Every time a miner unlocks a bitcoin block, vis-a-vis mining, all the transactions on that block are processed. T...'
            },
          __v: 0,
          votes: 0,
          topic: ['bitcoin', 'crypto']
        },
        {
          _id: '5a6fe042aae7deb407d9f382',
          updatedAt: '2018-01-30T03:02:26.938Z',
          createdAt: '2018-01-30T03:02:26.938Z',
          post:
            {
              uuid: 'f2c66697bc8b99f7fa062df2f36070f1f3d32b10',
              site: 'huffingtonpost.com',
              url: 'http://omgili.com/ri/jHIAmI4hxg8kBMzlsF_JTjQdlO8_P5DHS7vvZzrbDOhRZcMeD3Y8iLFzq02yw1.GeLkDGHNmwXOp4.Csu37SoGR_srTi1JpaX23BcXGWfNIaTsZhFcCOhOlJxMRtdoqUMbwVTbUOt6OAZcT1b8Ahzga9uPUJQI6K',
              author: 'Logan Kugler',
              published: '2017-08-24T16:20:00.000+03:00',
              title: '10 Top Cryptocurrency Investors Share Their Favorite Long Term Picks | HuffPost',
              crawled: '2017-08-24T21:38:36.005+03:00',
              text: '10 Top Cryptocurrency Investors Share Their Favorite Long Term Picks 08/24/2017 09:20 am ET Updated 4 hours ago Licensed from Adobe Stock 730 \nThere’s a lot of focus right now on short-term speculation in the cryptocurrency space. But at some undefined future point, a reversal from speculation to value is going to happen. And when it does, you’llwant to be in the right positions. \nInvesting exclusively in tokens with real world value creation is the philosophy that my crypto hedge fund, General Crypto , is predicated on. Unless you’re a skilled day trader and don’t mind incredible stress leve...'
            },
          __v: 0,
          votes: 0,
          topic: ['crypto']
        }]
      }

      axiosStub.get.returns(Promise.resolve(favArr))

      dbClient.getUserFavorites(userId, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/users/${userId}/favorites`
          expect(axiosStub.get.calledWith(url)).to.be.true
          expect(data).to.eql(favArr);
          axiosStub.get.reset();
          done();
        })
    })
  })

  describe('.getUsers', () => {
    it('should send a GET request to sentiment-db to url /users', (done) => {      
      axiosStub.get.returns(Promise.resolve('array of users'))

      dbClient.getUsers(axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/users`
          expect(axiosStub.get.calledWith(url)).to.be.true
          axiosStub.get.reset();
          done();
        })
    })
  })

  describe('.deleteFavorite', () => {
    it('should send a DELETE request to sentiment-db to url /favorites/:user_id/:thread_id', (done) => {
      let userId = '5a6fdd8796616cb174d746e3'
      let threadId = '5a6fdd8796616cb174d746e6'

      axiosStub.delete.returns(Promise.resolve('ok'))

      dbClient.deleteFavorite(userId, threadId, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/favorites/${userId}/${threadId}`
          expect(axiosStub.delete.calledWith(url)).to.be.true
          axiosStub.delete.reset();
          done();
        })
    })
  })

  describe('.createComment', () => {
    it('should send a POST request to sentiment-db /comments with threadId, userId, commentId and text payload', (done) => {
      let payload = { 
        threadId: '5a6fdd8796616cb174d746e3',  
        userId: '5a6fdd8796616cb174d746e3', 
        commentId: 'abc', 
        text: 'this is a reply comment' 
      }      

      axiosStub.post.returns(Promise.resolve('ok'))

      dbClient.createComment(payload, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/comments`
          expect(axiosStub.post.args[0]).to.eql([url, payload])
          axiosStub.post.reset();
          done();
        })
    })
  })
  
  describe('.deleteComment', () => {
    it('should send a DELETE request to sentiment-db to url /comments/:thread_id/:comment_id', (done) => {
      let threadId = '5a6fdd8796616cb174d746e6'
      let commentId = 'abc'

      axiosStub.delete.returns(Promise.resolve('ok'))

      dbClient.deleteComment(threadId, commentId, axiosStub)
        .then(data => {
          let url = `${config.sentimentDBHost}/comments/${threadId}/${commentId}`
          expect(axiosStub.delete.calledWith(url)).to.be.true
          axiosStub.delete.reset();
          done();
        })
    })
  })
  
})
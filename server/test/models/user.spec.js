// Testing libraries
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Helpers
let moment = require('moment');
let seeder = require('../helpers/seeder.js');

// App requires
let server = require('../../server.js');
let mongoose = require('mongoose');
let User = require('../../models/user');
let bcrypt = require('bcrypt')
let _ = require('lodash')

beforeEach('drop the collection and reseed database', function (done) {
  mongoose.connection.collections.users.drop(function () {
    seeder.users(done)
  });
});

describe.only('#User', function () {
  it('should return all the users on GET /users/all', function (done) {
    chai.request(server)
      .get('/users')
      .end(function (err, res) {
        let data = res.body
        let input = data.map(user => _.pick(user, ['email', 'admin']))
        let actual = [{ email: 'howie@gmail.com', admin: true }, { email: 'felix@gmail.com', admin: false }]
        expect(input).to.deep.include.members(actual)
        done();
      })
  });

  it('should return a single user on GET /users/:id', function (done) {
    chai.request(server)
      .get('/users')
      .end(function (err, res) {
        let howie = res.body.filter(user => user.email === 'howie@gmail.com')[0]
        chai.request(server)
          .get(`/users/${howie._id}`)
          .end(function(err, res){
            let data = res.body
            let input = _.pick(data, ['email', 'admin'])
            let actual = { email: 'howie@gmail.com', admin: true }
            expect(input).to.eql(actual)

            // Check password
            let checkPassword = bcrypt.compareSync('chicken', data.password)
            expect(checkPassword).to.be.ok
            done();            
          })
      })
  });

  // it('should return a single doc on GET /threads/topic/id/:id', function (done) {
  //   chai.request(server)
  //     .get('/threads/all')
  //     .end(function (err, resp) {
  //       let sampleId = resp.body[0]._id;

  //       chai.request(server)
  //         .get(`/threads/topic/id/${sampleId}`)
  //         .end(function (err, resp) {
  //           let input = resp.body._id
  //           let actual = sampleId
  //           expect(input).to.equal(actual)
  //           done();
  //         })
  //     })
  // })

  // it('should return error message if no doc exists with that id on GET /threads/topic/id/:id', function (done) {
  //   chai.request(server)
  //     .get('/threads/topic/id/123')
  //     .end(function (err, resp) {
  //       expect(resp.status).to.equal(422)
  //       expect(resp.body.error).to.equal('Cast to ObjectId failed for value "123" at path "_id" for model "Thread"')
  //       done()
  //     })
  // })

  // it('should add a single thread on POST /threads', function (done) {
  //   let posts = require('../data/posts.json');
  //   let post = posts[2]

  //   chai.request(server)
  //     .post('/threads')
  //     .send({ topic: ['banana boat'], post })
  //     .end(function (err, resp) {
  //       let data = resp.body;
  //       let topic = data.topic;
  //       let date = moment(data.date).format('YYYY');
  //       let today = moment().format('YYYY');
  //       expect(topic).to.eql(['banana boat']);
  //       expect(date).to.equal(today);
  //       expect(data.post).to.eql(post);
  //       done();
  //     })
  // });

  // it('should validate if the post uuid already exists with same topic before creating thread via POST /threads', function (done) {
  //   let posts = require('../data/posts.json');
  //   let post = posts[1];
  //   chai.request(server)
  //     .post('/threads')
  //     .send({ topic: ['bitcoin'], post })
  //     .end(function (err, resp) {
  //       let input = resp.body;
  //       let actual = {
  //         message: 'Post already exists'
  //       }
  //       expect(input).to.eql(actual)
  //       done();
  //     })
  // })

  // it('should update if the post uuid already exists but topic is different via POST /threads', function (done) {
  //   let posts = require('../data/posts.json');
  //   let post = posts[1];
  //   chai.request(server)
  //     .post('/threads')
  //     .send({ topic: ['fatcat'], post })
  //     .end(function (err, resp) {
  //       let input = resp.body.topic;
  //       let actual = ['bitcoin', 'crypto', 'fatcat']
  //       expect(input).to.eql(actual)
  //       done();
  //     })
  // })

  // it('should return all topic threads on GET /threads/topic/:topic', function (done) {
  //   chai.request(server)
  //     .get('/threads/topic/bitcoin')
  //     .end(function (err, resp) {
  //       let input = resp.body.map(el => {
  //         return Object.assign({}, {
  //           topic: el.topic,
  //           createdAt: moment(el.createdAt).format('YYYY')
  //         })
  //       })
  //       let actual = [
  //         { topic: ['bitcoin'], createdAt: '2018' },
  //         { topic: ['bitcoin'], createdAt: '2018' },
  //       ]
  //       expect(input).to.deep.include.members(actual);
  //       done();
  //     })
  // });

  // it('should return the latest topic thread on GET /threads/topic/:topic/latest', function (done) {
  //   chai.request(server)
  //     .get('/threads/topic/bitcoin/latest')
  //     .end(function (err, resp) {
  //       expect(resp.body.length).to.equal(1);
  //       let data = resp.body[0];
  //       let topic = data.topic;
  //       let post = data.post;
  //       let posts = require('../data/posts.json');
  //       let actual = posts[1]

  //       expect(topic).to.eql(['bitcoin', 'crypto']);
  //       expect(post).to.eql(actual);
  //       done();
  //     })
  // });

  // it('should return all relevant site documents when passed an array of sites via POST /threads/sites', function (done) {
  //   chai.request(server)
  //     .post('/threads/sites')
  //     .send({ topic: 'bitcoin', sites: ['businessinsider.com'] })
  //     .end(function (err, resp) {
  //       let input = resp.body[0].post.site;
  //       let actual = 'businessinsider.com'
  //       expect(input).to.equal(actual)
  //       done()
  //     })
  // })

  // it('should delete a topic by id on DELETE /threads/topic/id/:id', function (done) {
  //   Thread
  //     .findOne({ topic: 'monero' })
  //     .then(data => {
  //       let id = data.id;
  //       chai.request(server)
  //         .delete(`/threads/topic/id/${id}`)
  //         .end(function (err, resp) {
  //           expect(resp.body.topic).to.eql(['monero']);
  //           chai.request(server)
  //             .get('/threads/topic/monero')
  //             .end(function (err, resp) {
  //               expect(resp.body.length).to.equal(0);
  //               done();
  //             })
  //         })
  //     })
  // });

  // it('should update a topic by id on PUT /threads/topic/id/:id', function (done) {
  //   Thread
  //     .findOne({ topic: 'bitcoin' })
  //     .then(data => {
  //       let id = data.id;
  //       let document = { topic: ['miaow'], post: { title: 'cat hero' } }

  //       chai.request(server)
  //         .put(`/threads/topic/id/${id}`)
  //         .send(document)
  //         .end(function (err, resp) {
  //           expect(resp.body.topic).to.eql(['miaow']);
  //           expect(resp.body.post).to.eql(document.post);
  //           done();
  //         })
  //     })
  // });

  // it('should update a topic with given votes on PUT /threads/topic/id/:id', function (done) {
  //   Thread
  //     .findOne({ topic: 'bitcoin' })
  //     .then(data => {
  //       let id = data.id;

  //       chai.request(server)
  //         .put(`/threads/topic/id/${id}`)
  //         .send({ post: { title: 'optional' }, votes: 1 })
  //         .end(function (err, resp) {
  //           expect(resp.body.topic).to.eql(['bitcoin'])
  //           expect(resp.body.votes).to.equal(1)
  //           done();
  //         })
  //     })
  // })
  // it('should find all topics by topic name and published since on GET /threads/topic/query?topic=name%20daysAgo=number', function (done) {
  //   chai.request(server)
  //     .get('/threads/topic/query?topic=crypto&topic=bitcoin&daysAgo=300')
  //     .end(function (err, resp) {
  //       expect(resp.body[0].topic).to.eql(['bitcoin', 'crypto'])
  //       done()
  //     })
  // })
})

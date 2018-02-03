// Testing libraries
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

// Helpers
let seeder = require('../helpers/seeder.js');

// App requires
let server = require('../../server.js');
let mongoose = require('mongoose');
let Favorite = require('../../models/favorite');
let User = require('../../models/user');
let Thread = require('../../models/thread');
let Comment = require('../../models/comment');
let _ = require('lodash')
let util = require('util')


describe('#Comment', function () {
  beforeEach('drop the collection and reseed database', function (done) {
    mongoose.connection.collections.threads.drop(function () {
      seeder.comments(done)
    });
  });

  it('should return a single post with all comments on GET /threads/:id', async () => {
    let threads = await Thread.find()
    let id = await threads[0]._id
    let res = await chai.request(server).get(`/threads/${id}`)
    let comments = res.body.comments
    expect(comments.length).to.equal(2)
    expect(comments[0]).to.contain.keys(['_id', 'comment_id', 'createdAt', 'updatedAt', 'text', 'user', 'text'])
    
    let comment = comments[0]
    let reply = comments[1]
    expect(comment._id).to.eql(reply.comment_id)
    
    let input = comments.map(el => Object.assign({}, { email: el.user.email, text: el.text }))
    let actual = [
      { email: 'hela@gmail.com', text: 'I love bitcoin' },
      { email: 'howie@gmail.com', text: 'Hela that is amazing' }
    ]
    expect(input).to.eql(actual)
  });
})



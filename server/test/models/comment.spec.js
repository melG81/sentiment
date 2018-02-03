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


describe.only('#Comment', function () {
  beforeEach('drop the collection and reseed database', function (done) {
    mongoose.connection.collections.threads.drop(function () {
      seeder.comments(done)
    });
  });

  it('should return a post with all comments on GET /threads/all', function (done) {
    chai.request(server)
      .get('/threads/all')
      .end(function (err, res) {
        let data = res.body
        let input = data.length
        console.log(util.inspect(data, false, null));
        // let actual = 2
        // expect(input).to.equal(actual)
        done();
      })
  });
})



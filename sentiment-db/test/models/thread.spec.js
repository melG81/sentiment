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
let Thread = require('../../models/thread');

describe.only('thread', function () {
  beforeEach('drop the collection and reseed database', function(done){
    mongoose.connection.collections.threads.drop(function () {
      seeder.threads(done)
    });        
  });

  it('should return all the threads on GET /threads', function (done) {
    chai.request(server)
      .get('/threads')
      .end(function (err, resp) {
        let input = resp.body.map(el => {
          return Object.assign({}, {
            topic: el.topic,
            createdAt: moment(el.createdAt).format('MMMM YYYY')
          })
        })
        let actual = [
          {topic: 'bitcoin', createdAt: 'August 2017'},
          {topic: 'gold', createdAt: 'August 2017' },
          {topic: 'monero', createdAt: 'August 2017' }
        ]
        expect(input).to.deep.include.members(actual);                
        done();
      })
  });
})
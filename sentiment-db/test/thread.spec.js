var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server.js');

describe('thread', function () {
<<<<<<< HEAD
  it('should return all the threads on GET /threads', function (done) {
=======
  it('should return all threads on GET /threads', function (done) {
>>>>>>> e8768128e192151a03e1e7359193d5d8b3779f5a
    chai.request(server)
      .get('/threads')
      .end(function (err, resp) {
        let input = resp.body;
        let actual = { 
          data: [
<<<<<<< HEAD
            { topic: 'bitcoin', createdAt: 'Sun Aug 27 2017 11:24:01 GMT+1000 (AEST)' },
            { topic: 'monero', createdAt: 'Sun Aug 27 2017 11:24:01 GMT+1000 (AEST)' },
            { topic: 'gold', createdAt: 'Sun Aug 27 2017 11:24:01 GMT+1000 (AEST)' }
=======
            { topic: 'bitcoin'},
            { topic: 'monero' },
            { topic: 'gold' }
>>>>>>> e8768128e192151a03e1e7359193d5d8b3779f5a
          ]
         }
        expect(resp).to.have.status(200);
        expect(input).to.eql(actual);
        done();
      })
  });
})
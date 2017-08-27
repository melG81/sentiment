var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server.js');

describe('thread', function () {
  it('should return all threads on GET /threads', function (done) {
    chai.request(server)
      .get('/threads')
      .end(function (err, resp) {
        let input = resp.body;
        let actual = { 
          data: [
            { topic: 'bitcoin'},
            { topic: 'monero' },
            { topic: 'gold' }
          ]
         }
        expect(resp).to.have.status(200);
        expect(input).to.eql(actual);
        done();
      })
  });
})
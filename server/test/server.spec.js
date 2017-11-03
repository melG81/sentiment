var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server.js');

describe('server', function(){
  it('should exist', () => expect(server).to.not.be.undefined);
  it('should return ok on GET /', function(done){
    chai.request(server)
      .get('/')
      .end(function(err, resp){
        let input = resp.body;
        let actual = { status: 'ok'}      
        expect(resp).to.have.status(200);
        expect(input).to.eql(actual);
        done();
      })
  });
  it('should return 404 on invalid GET routes', function(done){
    chai.request(server)
      .get('/banana')
      .end(function(err, resp){
        let input = resp.body;
        let actual = { status: 'Page does not exist'}      
        expect(resp).to.have.status(404);
        expect(input).to.eql(actual);
        done();
      })
  });
})
var chai = require('chai');
var expect = chai.expect;
var cheerio = require('cheerio');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server.js');

describe('server', function () {
  it('should exist', () => expect(server).to.not.be.undefined);
  it('should return home page on GET /', function (done) {
    chai.request(server)
      .get('/')
      .end(function (err, res) {
        let $ = cheerio.load(res.text);
        let $welcome = $('#welcome');
        let input = $welcome.text();
        let actual = 'Hello World';

        expect(input).to.equal(actual);
        done();
      })
  });
  it('should return 404 on invalid GET routes', function (done) {
    chai.request(server)
      .get('/banana')
      .end(function (err, resp) {
        let input = resp.body;
        let actual = { status: 'Page does not exist' }
        expect(resp).to.have.status(404);
        expect(input).to.eql(actual);
        done();
      })
  });
})
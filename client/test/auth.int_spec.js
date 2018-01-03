var chai = require('chai');
var expect = chai.expect;
var cheerio = require('cheerio');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server.js');
let User = require('../src/util/user')

describe('server', function () {
  beforeEach('create user', function(done){
    User.create({email: 'howie@gmail.com', password: 'chicken', admin: true })
      .then(() => done())
  });
  
  afterEach(function(done){
    User
      .findByEmail('howie@gmail.com')
      .then(res => {
        let user = res.data[0]
        return User.delete(user._id)
      })
      .then(() => done())
  });

  it('should return the login page on GET /', function (done) {
    chai.request(server)
      .get('/login')
      .end(function (err, res) {
        let $ = cheerio.load(res.text);
        let $login = $('h3');
        let input = $login.text();
        let actual = 'Login';
        expect(input).to.equal(actual)
        done();
      })
  });

  it('should authenticate page on POST /login and redirect to /admin', function (done) {
    chai.request.agent(server)
      .post('/login')
      .send({
        email: 'howie@gmail.com',
        password: 'chicken'
      })
      .end(function (err, res) {
        let $ = cheerio.load(res.text)        
        let input = $('h3').text()
        let actual = 'Admin page'
        
        expect(input).to.equal(actual)
        done();
      })
  });

  it('should redirect to /login if unauthorized visit to /admin', function (done) {
    chai.request.agent(server)
      .get('/admin')
      .end(function (err, res) {
        let $ = cheerio.load(res.text)        
        let input = $('h3').text()
        let actual = 'Login'
        
        expect(input).to.equal(actual)
        done();
      })
  });

  it('should flash error message on login page if invalid POST /login', function (done) {
    chai.request.agent(server)
      .post('/login')
      .send({
        email: 'howie@gmail.com',
        password: 'fail'
      })
      .end(function (err, res) {
        let $ = cheerio.load(res.text)
        let input = $('.flash-message').text()
        let actual = 'Email and/or password do not match.'

        expect(input).to.equal(actual)
        done();
      })
  });
})
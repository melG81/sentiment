var chai = require('chai');
var expect = chai.expect;
var cheerio = require('cheerio');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var server = require('../server.js');
let User = require('../src/util/user')

describe.only('server', function () {
  beforeEach('create user', function(done){
    let howieAdmin = User.create({ email: 'howie@gmail.com', password: 'chicken', admin: true })
    let joe = User.create({ email: 'joe@gmail.com', password: 'chicken' })
    Promise.all([howieAdmin, joe])
      .then(() => done())
  });
  
  afterEach(function(done){
    User.find().then(res => {
      let data = res.data
      let howieAdmin = data.filter(user => user.email === "howie@gmail.com")[0]
      let joe = data.filter(user => user.email === "joe@gmail.com")[0]
      return Promise.all([User.delete(howieAdmin._id), User.delete(joe._id)])
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

  it('should redirect to /profile if unauthorized non-admin visit to /admin', function (done) {
    let agent = chai.request.agent(server)
    agent
      .post('/login')
      .send({
        email: 'joe@gmail.com',
        password: 'chicken'
      })
      .end(function (err, res) {
        agent
          .get('/admin')
          .end(function (err, res) {
            let $ = cheerio.load(res.text)
            let input = $('h3').text()
            let actual = 'User Profile'

            expect(input).to.equal(actual)
            done();
          })        
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

  it('should create a new user on POST /signup', function(done){
    chai.request.agent(server)
      .post('/signup')
      .send({
        email: 'valid@gmail.com',
        password: 'chicken'
      })
      .end(function (err, res) {
        let $ = cheerio.load(res.text)
        let input = $('.flash-message').text()
        let actual = 'Successfully signed up.'
        expect(input).to.equal(actual)
        
        User.findByEmail('valid@gmail.com')
          .then(res => {
            let user = res.data[0]
            let userId = user._id
            return User.delete(userId)
          })
          .then(() => done())
      })
  })
  
  it('should check if email is taken on POST /signup', function(done){
    chai.request.agent(server)
      .post('/signup')
      .send({
        email: 'howie@gmail.com',
        password: 'chicken'
      })
      .end(function (err, res) {
        let $ = cheerio.load(res.text)
        let input = $('.flash-message').text()
        let actual = 'Email already taken.'
        expect(input).to.equal(actual)
        done()
      })
  })
  
})
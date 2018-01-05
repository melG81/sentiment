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

describe('#User', function () {
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

  it('should return a single user on GET /users/email/:email', function (done) {
    chai.request(server)
      .get('/users')
      .end(function (err, res) {
        let howie = res.body.filter(user => user.email === 'howie@gmail.com')[0]
        chai.request(server)
          .get(`/users/email/${howie.email}`)
          .end(function(err, res){
            let data = res.body[0]
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

  it('should create a single user on POST /users', function (done) {
    chai.request(server)
      .post('/users')
      .send({
        email: 'hela@gmail.com',
        password: 'chicken'
      })
      .end(function (err, res) {
        let input = _.pick(res.body, ['email', 'admin'])
        let actual = {email: 'hela@gmail.com', admin: false}
        expect(input).to.eql(actual)
        done()
      })
  });

  it('should update a single user on PUT /users/:id', function (done) {
    let newPassword = 'salad'

    chai.request(server)
      .get('/users')
      .end(function (err, res) {
        let howie = res.body.filter(user => user.email === 'howie@gmail.com')[0]
        chai.request(server)
          .put(`/users/${howie._id}`)
          .send({
            password: newPassword
          })
          .end(function (err, res) {
            let data = res.body
            let input = _.pick(data, ['email', 'admin'])
            let actual = {email: 'howie@gmail.com', admin: true}
            expect(input).to.eql(actual)
            // Check password
            let checkPassword = bcrypt.compareSync(newPassword, data.password)
            expect(checkPassword).to.be.ok
            done();
          })
      })
  });

  it('should delete a single user on DELETE /users/:id', function (done) {
    let howieEmail = 'howie@gmail.com'

    chai.request(server)
      .get('/users')
      .end(function (err, res) {
        let howie = res.body.filter(user => user.email === howieEmail)[0]

        let input = res.body.map(user => user.email)
        let actual = howieEmail
        expect(input).to.include(actual)

        chai.request(server)
          .delete(`/users/${howie._id}`)
          .end(function (err, res) {
            
            chai.request(server)
              .get('/users')
              .end(function(err, res){
                let input = res.body.map(user => user.email)
                let actual = howieEmail
                expect(input).to.not.include(actual)
                done()
              })
          })
      })
  });



})

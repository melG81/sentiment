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
let _ = require('lodash')


describe('#Favorite', function () {
  beforeEach('drop the collection and reseed database', function (done) {
    mongoose.connection.collections.favorites.drop(function () {
      seeder.favorites(done)
    });
  });

  it('should return all the favorites on GET /favorites', function (done) {
    chai.request(server)
      .get('/favorites')
      .end(function (err, res) {
        let data = res.body
        let input = data.length
        let actual = 2
        expect(input).to.equal(actual)
        done();
      })
  });
  it('should return all of a users favorites on GET /users/:id/favorites', function (done) {
    chai.request(server)
      .get('/users/email/hela@gmail.com')
      .end(function (err, res) {
        let data = res.body
        let userId = data[0]._id

        chai.request(server)
          .get(`/users/${userId}/favorites`)
          .end(function (err, res) {
            let data = res.body
            let input = data.map(el => el.topic)
            let actual = [['bitcoin', 'crypto'], ['crypto']]
            expect(input).to.eql(actual)
            done();
          })
      })
  });
  it('should delete a favorite on DELETE /favorites/:id', function (done) {
    chai.request(server)
      .get('/favorites')
      .end((err, res) => {
        let data = res.body
        var input = data.length
        var actual = 2
        expect(input).to.equal(actual)

        let fav = res.body[0]
        chai.request(server)
          .delete(`/favorites/${fav._id}`)
          .end((err, res) => {
            chai.request(server)
              .get('/favorites')
              .end((err, res) => {
                let data = res.body
                var input = data.length
                var actual = 1
                expect(input).to.equal(actual)
                done()
              })
          })
      })

  });
  it('should also delete a favorite on DELETE /favorites/:user_id/:thread_id', function (done) {
    chai.request(server)
      .get('/favorites')
      .end((err, res) => {
        let data = res.body
        var input = data.length
        var actual = 2
        expect(input).to.equal(actual)

        let fav = res.body[0]
        let userId = fav.user
        let threadId = fav.thread
        chai.request(server)
          .delete(`/favorites/${userId}/${threadId}`)
          .end((err, res) => {
            chai.request(server)
              .get('/favorites')
              .end((err, res) => {
                let data = res.body
                var input = data.length
                var actual = 1
                expect(input).to.equal(actual)
                done()
              })
          })
      })


  })
})



let seeder = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let Thread = require('../../models/thread');
let posts = require('../data/posts.json');

/**
 * @function {wraps the defalt mongoose.create method in a promise}
 * @param  {Object} obj {document properties to be created}
 * @return {Promise}
 */
mongoose.Model.seed = function (obj) {
  return new Promise((resolve, reject) => {
    this.create(obj, function (err) {
      if (err) { reject(err); }
      resolve();
    });
  });
};

/**
 * @function {our database seed script to be called beforeEach test runs}
 * @param  {String} done {for our tests to be able to call done after seeding is complete}
 * @return {Promise}
 */
seeder.threads = function (done) {
  let bitcoin = Thread.seed({ topic: ['bitcoin']});
  let monero = Thread.seed({ topic: ['monero']});
  let gold = Thread.seed({ topic: ['gold']});
  let bitcoin2 = Thread.seed({ topic: ['bitcoin', 'crypto'], post: posts[1] });

  Promise.all([bitcoin, monero, gold, bitcoin2])
    .then(() => done());
};

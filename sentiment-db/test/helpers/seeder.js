let seeder = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let Thread = require('../../models/thread');
let posts = require('../data/posts.json');

// Wrap create object into a promise so we can call Promise.all
mongoose.Model.seed = function (obj) {
  return new Promise((resolve, reject) => {
    this.create(obj, function (err) {
      if (err) { reject(err); }
      resolve();
    });
  });
};

seeder.threads = function (done) {
  let bitcoin = Thread.seed({ topic: 'bitcoin'});
  let monero = Thread.seed({ topic: 'monero'});
  let gold = Thread.seed({ topic: 'gold'});
  let bitcoin2 = Thread.seed({ topic: 'bitcoin', posts: posts });

  Promise.all([bitcoin, monero, gold, bitcoin2])
    .then(() => done());
};

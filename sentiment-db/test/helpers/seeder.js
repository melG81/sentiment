let seeder = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let Thread = require('../../models/thread');

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
  let bitcoin = Thread.seed({ topic: 'bitcoin', createdAt: new Date() });
  let monero = Thread.seed({ topic: 'monero', createdAt: new Date() });
  let gold = Thread.seed({ topic: 'gold', createdAt: new Date() });

  Promise.all([bitcoin, monero, gold])
    .then(() => done());
};

let seeder = module.exports = {};

// Dependencies
let mongoose = require('mongoose');
let Thread = require('../../models/thread');
let User = require('../../models/user');
let Favorite = require('../../models/favorite');
let posts = require('../data/posts.json');
let bcrypt = require('bcrypt')

/**
 * @function {wraps the defalt mongoose.create method in a promise}
 * @param  {Object} obj {document properties to be created}
 * @return {Promise}
 */
mongoose.Model.seed = function (obj) {
  return new Promise((resolve, reject) => {
    this.create(obj, function (err) {
      if (err) { reject(err); }      
    }).then(data => {
      resolve(data);
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

seeder.users = function (done) {
  let howiePassword = bcrypt.hashSync('chicken', 10)
  let felixPassword = bcrypt.hashSync('chicken', 10)

  let howie = User.seed({ email: 'howie@gmail.com', password: howiePassword, admin: true});
  let felix = User.seed({ email: 'felix@gmail.com', password: felixPassword});

  Promise.all([howie, felix])
    .then(() => done());
};

seeder.favorites = async function (done) {
  // Drop users and threads before starting
  await mongoose.connection.collections.users.drop()
  await mongoose.connection.collections.threads.drop()
  
  let hela = await User.seed({ email: 'hela@gmail.com', password: bcrypt.hashSync('chicken', 10)});
  let bitcoinThread = await Thread.seed({ topic: ['bitcoin', 'crypto'], post: posts[1] });
  let cryptoThread = await Thread.seed({ topic: ['crypto'], post: posts[3] });
  let bitcoin2Thread = await Thread.seed({ topic: ['bitcoin'], post: posts[2] });

  let favoriteBitcoin = await Favorite.seed({user: hela._id, thread: bitcoinThread._id})
  let favoriteCrypto = await Favorite.seed({user: hela._id, thread: cryptoThread._id})
  
  done()
};

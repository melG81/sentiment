let schedule = module.exports = {}

// Dependencies for schedule
const Agenda = require('agenda')
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PW;
let mongoConnectionString = `mongodb://${username}:${password}@ds243285.mlab.com:43285/sentiment-production`;
let agenda = new Agenda({ db: { address: mongoConnectionString } });

// API poll
let { pollScript } = require('../util/api')

schedule.connect = function () {

  // TODO: Change pollScript so it can accept an array of queries

  // Define script poll for query cryptocurrency
  agenda.define('poll cryptocurrency', function (job, done) {
    console.log('poll cryptocurrency start');
    
    let query = 'cryptocurrency';
    let daysAgo = '1';
    
    pollScript(query, daysAgo)
      .then(results => {
        console.log(results);
        done();
      })
      .catch(err => {
        console.log(err);
      })      
  });

  // Define script poll for query bitcoin
  agenda.define('poll bitcoin', function (job, done) {
    console.log('poll bitcoin start');
    
    let query = 'bitcoin';
    let daysAgo = '1';
    
    pollScript(query, daysAgo)
      .then(results => {
        console.log(results);
        done();
      })
      .catch(err => {
        console.log(err);
      })
  });

  // Define script poll for query ethereum
  agenda.define('poll ethereum', function (job, done) {
    console.log('poll ethereum start');
    
    let query = 'ethereum';
    let daysAgo = '1';
    
    pollScript(query, daysAgo)
      .then(results => {
        console.log(results);
        done();
      })
      .catch(err => {
        console.log(err);
      })
  });

  // Define script poll for query ethereum on forums
  agenda.define('poll ethereum discussions', function (job, done) {
    console.log('poll ethereum discussions start');
    
    let query = 'ethereum';
    let daysAgo = '1';
    
    pollScript(query, daysAgo, 'discussions')
      .then(results => {
        console.log(results);
        done();
      })
      .catch(err => {
        console.log(err);
      })
  });

  // Define script poll for query bitcoin on forums
  agenda.define('poll bitcoin discussions', function (job, done) {
    console.log('poll bitcoin discussions start');

    let query = 'bitcoin';
    let daysAgo = '1';

    pollScript(query, daysAgo, 'discussions')
      .then(results => {
        console.log(results);
        done();
      })
      .catch(err => {
        console.log(err);
      })
  });
  
  // Define script poll for query ripple coin XRP on forums
  agenda.define('poll xrp discussions', function (job, done) {
    console.log('poll xrp discussions start');

    let query = 'xrp';
    let daysAgo = '1';

    pollScript(query, daysAgo, 'discussions')
      .then(results => {
        console.log(results);
        done();
      })
      .catch(err => {
        console.log(err);
      })
  });
  

  agenda.on('ready', function () {
    console.log('Agenda ready');
    agenda.every('3 hours', 'poll cryptocurrency');
    agenda.every('4 hours', 'poll bitcoin');
    // agenda.every('4 hours', 'poll bitcoin discussions');
    agenda.every('12 hours', 'poll ethereum');
    // agenda.every('12 hours', 'poll ethereum discussions');
    // agenda.every('12 hours', 'poll xrp discussions');
    agenda.start();
  });


  // Graceful restart of job queue if server is stopped
  function graceful() {
    agenda.stop(function () {
      process.exit(0);
    });
  }

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);  
};

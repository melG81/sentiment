let topics = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let sitesArr = require('../src/filters/sitesFiltered.js')
let _ = require('lodash')


topics.show = function (req, res, next) {
  let topicName = req.params.name
  dbClient.getByTopicAndSites(topicName, sitesArr)
    .then(payload => {
      res.send(payload.data)
    })
    .catch(next)
};


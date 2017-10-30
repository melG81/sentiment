let topics = module.exports = {}

// Dependencies
let dbClient = require('../src/util/dbClient')
let sitesArr = require('../src/filters/sitesFiltered.js')
let _ = require('lodash')


topics.show = function (req, res, next) {
  let topicName = req.params.name
  let sortQuery = req.query.sort
  dbClient.getByTopicAndSites(topicName, sitesArr)
    .then(payload => {
      // Filter by unique post titles
      let uniqPayload = _.uniqBy(payload.data, 'post.title')
      // Sort by most recent published unless query param includes ?sort=descending
      let sortPayload = () =>{
        if (sortQuery === 'descending') {
          return uniqPayload.sort((a, b) => new Date(a.post.published) - new Date(b.post.published))
        }
        return uniqPayload.sort((a, b) => new Date(b.post.published) - new Date(a.post.published))
      }

      res.render('topics/show',{
        topicName,
        data: sortPayload()
      })
    })
    .catch(next)
};


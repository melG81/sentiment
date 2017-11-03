let google = module.exports = {}

// Dependencies
let config = require('../../config.js');
let dbClient = require('./dbClient.js')
let _ = require('lodash')
let client = 'TODO'

google.analyze = (text, client) => {
  let document = {
    content: text,
    type: 'PLAIN_TEXT',    
  }
  return client.analyzeSentiment(document)
}

/**
 * @function {analyzes a single document post title for sentiment and updates document}
 * @param  {Object} doc {full document object}
 * @return {Promise} {dbClient.updateThread put Promise}
 */
google.postUpdateSentiment = (doc) => {
  let title = _.get(doc, 'post.title')
  let id = doc._id
  return new Promise ((resolve, reject) => {
    if (doc.documentSentiment) {
      resolve('Sentiment already exists')
    }
    google.analyze(title, client)
      .then(result => {
        return Object.assign(doc, result)
      })
      .then(newDoc => {
        resolve(dbClient.updateThread(id, newDoc))
      })
  })
}
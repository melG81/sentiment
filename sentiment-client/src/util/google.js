let google = module.exports = {}

// Dependencies
let config = require('../../config.js');

google.analyze = (text, client) => {
  let document = {
    content: text,
    type: 'PLAIN_TEXT',    
  }
  return client.analyzeSentiment(document)
}
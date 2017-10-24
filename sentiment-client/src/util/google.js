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


// TODO
// Fetch topic thread
// Iterate through all posts to check if there is a documentSentiment property
// If not, run google sentimentAnalysis and update post
// Take new document and send put update request to db

// Psudo code
// get all topics since a specific date range
// for loop through each topic and its posts. If documentSentiment doesn't exist, call the google api
// and add a new sentiment property to the document
// Update the topic

// google.pollSentiment = (topic, date) => {
//   dbClient.getTopics(topic, data)
//     .then(topics => {
//       topics.forEach(topic => {
//         let topicId = topic._id
//         let newPosts = topic.posts.map(post => {
//           if (post.documentSentiment) { 
//             return post
//           } else {
//             google.analyze(post.title).then(results => {
//               return Object.assign(post, {documentSentiment: results.documentSentiment})
//             })
//           }
//         })
//         let newDocument = {
//           topic,
//           posts: newPosts
//         }
//         dbClient.updateThread(topicId, newDocument)
//       })
//     })
// }
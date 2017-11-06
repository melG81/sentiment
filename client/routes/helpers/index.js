let helpers = module.exports = {};

// Dependencies
let _ = require('lodash')
let moment = require('moment')

// TODO: Unit test
/**
 * @function {sorts array payload by unique titles and date published}
 * @param  {Array} array       {array of posts}
 * @param  {String} sortBy  {"descending" otherwise blank will sort ascending}
 * @return {Array} {filtered array of posts}
 */

helpers.sortPayload = (array, sortBy) => {
  // Filter by unique post titles
  let uniqPayload = _.uniqBy(array, 'post.title')
  // Set default vote 0 if no vote
  let payloadWithVotes = uniqPayload.map(doc => {
    if (doc.votes) {
      return doc
    } else {
      return Object.assign(doc, {votes:0})
    }
  })
  // Sort by most recent published unless query param includes ?sort=descending
  if (sortBy === 'descending') {
    return payloadWithVotes.sort((a, b) => new Date(moment(a.post.published).format('YYYY-MM-DD')) - new Date(moment(b.post.published).format('YYYY-MM-DD')) || a.votes - b.votes)
  } else {
    return payloadWithVotes.sort((a, b) => new Date(moment(b.post.published).format('YYYY-MM-DD')) - new Date(moment(a.post.published).format('YYYY-MM-DD')) || b.votes - a.votes)
  }
}

helpers.checkVoteCookie = (req, res, next) => {
  let id = req.params.id
  let voteCookie = _.get(req, 'cookies.vote')
  let hasVoted = _.includes(voteCookie, id)
  if (hasVoted) {
    res.send({message: 'Limit one vote'})
  } else {
    let newCookie = voteCookie || [];
    newCookie.push(id)
    res.cookie('vote', newCookie)
    next()
  }
}


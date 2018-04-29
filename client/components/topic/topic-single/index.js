let axios = require('axios');
let truncate =  require('../../../src/helpers/truncate');
let parseHtml =  require('../../../src/helpers/parseHtml');
let scoreEmoji =  require('../../../src/helpers/scoreEmoji');
// CSS dependencies
require('./style.scss');

let makeTopicSingle = function(){
  this.idCache = [];
  this.init = () => {
    this.cacheDom()
    this.bindEvents()
  }
  this.cacheDom = () => {
    this.upVote = $('.post-upvote')
    this.downVote = $('.post-downvote')
    this.postTitle = $('.post-heading-title')
    this.postPreview = $('.post-more-preview')
    this.deletePost = $('.post-delete')
    this.postSentiment = $('.post-sentiment')
  }
  this.bindEvents = () => {
    this.postPreview.on('click', this.toggleShow)
    this.postTitle.on('click', this.toggleShow)
    this.upVote.on('click', this.postUpVote)
    this.downVote.on('click', this.postDownVote)
    this.deletePost.on('click', this.postDelete)
    this.postSentiment.on('click', this.postUpdateSentiment)
  }
  this.toggleShow = (e) => {
    let $target = $(e.target)
    let id = $target.data('id')
    let $postText = $target.closest('.post-body').find('.post-text')
    
    $postText.toggleClass('hide')    
    let txt = $postText.hasClass('hide') ? 'show' : 'hide';    
    // Check if id has already been fetched
    let hasFetched = this.idCache.includes(id)
    if (!hasFetched) {
      $postText.html('...fetching preview')
      // Fetch payload for post text and render in div    
      axios.get(`/topics/topic/id/${id}`).then(payload => {
        this.idCache.push(id)
        let payloadText = payload.data.post.text
        if (payloadText) {
          let parsedText = parseHtml(payloadText)
          let postText = truncate(parsedText, 2000)
          $postText.html(postText)
        } else {
          $postText.html('No preview available')          
        }
        this.postUpVote(e)
      })
    }
  }
  this.renderVote = ($target, payload) => {
    // Find nearest vote count
    let $voteCount = $target.parents('.post-admin').siblings('.post-subheading').find('.post-vote-count')
    // If votes exist then update nearest sibling vote count
    let data = payload.data;
    let votes = payload.data.votes;
    if (votes) {
      $voteCount.text(`${votes} clicks`)
    }
  }
  this.renderSentiment = ($target, score) => {
    // Find nearest sentiment index and update text
    let emoji = scoreEmoji(score)
    let $sentimentScore = $target.parents('.post-admin').siblings('.post-subheading').find('.post-sentiment-score')
    $sentimentScore.text(`${emoji}`)
  }
  this.postUpVote = (e) => {
    let $target = $(e.target);
    // get attr id
    let id = $target.data('id')
    // make post request
    axios.get(`/topics/topic/id/${id}/upvote`)
      .then(payload => {
        this.renderVote($target, payload)
      })
  }
  this.postDownVote = (e) => {
    let $target = $(e.target);
    // get attr id
    let id = $target.data('id')
    // make post request
    axios.get(`/topics/topic/id/${id}/downvote`)
      .then(payload => {
        this.renderVote($target, payload)
      })
  }
  this.postDelete = (e) => {
    let $target = $(e.target);
    // get attr id
    let id = $target.data('id')

    let result = confirm('Do you want to delete?')
    if (result) {
      // make delete request
      axios.delete(`/topics/topic/id/${id}`)
        .then(payload => {
          location.reload()
        })
    }
  }
  this.postUpdateSentiment = (e) => {
    let $target = $(e.target)
    let id = $target.parents('.post-admin').data('id')
    let score = $target.data('score')
    console.log(score, id);
    let payload = {
      score
    }
    console.log(payload);
    axios.put(`/topics/topic/id/${id}/sentiment`, payload)
      .then(res => {
        let newScore = res.data.documentSentiment.score
        this.renderSentiment($target, newScore)
      })
  }
}

let topicSingle = new makeTopicSingle()
module.exports = topicSingle

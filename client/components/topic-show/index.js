let axios = require('axios');
// CSS dependencies
require('./style.scss');

let makeTopicShow = function(){
  this.init = () => {
    this.cacheDom()
    this.bindEvents()
  }
  this.cacheDom = () => {
    this.postText = $('.post-text')
    this.showMore = $('.show-more')
    this.upVote = $('.post-upvote')
    this.downVote = $('.post-downvote')
  }
  this.bindEvents = () => {
    this.showMore.on('click', this.toggleShow)
    this.upVote.on('click', this.postUpVote)
    this.downVote.on('click', this.postDownVote)
  }
  this.toggleShow = function() {
    // Find nearest post text and toggle truncate
    let $postText = $(this).siblings('.post-text')
    $postText.toggleClass('post-preview')
    // Toggle show more, show less text upon clicking
    let txt = $postText.hasClass('post-preview') ? '...show more' : '...show less';
    $(this).text(txt)
  }
  this.renderVote = ($target, payload) => {
    // Find nearest vote count
    let $voteCount = $target.siblings('.post-vote-count')
    // If votes exist then update nearest sibling vote count
    let data = payload.data;
    let votes = payload.data.votes;
    if (votes) {
      $voteCount.text(`${votes} points`)
    }
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

}

let topicShow = new makeTopicShow()
module.exports = topicShow

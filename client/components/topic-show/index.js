let axios = require('axios');
// CSS dependencies
require('./style.scss');

let makeTopicShow = function(){
  this.idCache = [];
  this.init = () => {
    this.cacheDom()
    this.bindEvents()
  }
  this.cacheDom = () => {
    this.showMore = $('.post-toggle-text')
    this.upVote = $('.post-upvote')
    this.downVote = $('.post-downvote')
  }
  this.bindEvents = () => {
    this.showMore.on('click', this.toggleShow)
    this.upVote.on('click', this.postUpVote)
    this.downVote.on('click', this.postDownVote)
  }
  this.toggleShow = (e) => {
    let $target = $(e.target)
    let id = $target.data('id')
    let $postText = $target.parent('.post-subheading').next('.post-text')
    $postText.toggleClass('hide')
    // Toggle show hide text upon clicking
    let txt = $postText.hasClass('hide') ? 'show' : 'hide';
    $target.text(txt)

    // Check if id has already been fetched
    let hasFetched = this.idCache.includes(id)
    if (!hasFetched) {
      // Fetch payload for post text and render in div    
      axios.get(`/topics/topic/id/${id}`).then(payload => {
        this.idCache.push(id)
        let postText = payload.data.post.text
        $postText.text(postText)
      })
    } else {
      console.log(`${id} fetched`);
    }
  }
  this.renderVote = ($target, payload) => {
    // Find nearest vote count
    let $voteCount = $target.parent('.post-heading').next('.post-subheading').find('.post-vote-count')
    console.log($voteCount);
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

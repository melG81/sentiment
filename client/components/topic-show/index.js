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
  }
  this.bindEvents = () => {
    this.showMore.on('click', this.toggleShow)
  }
  this.toggleShow = function() {
    // Find nearest post text and toggle truncate
    let $postText = $(this).siblings('.post-text')
    $postText.toggleClass('post-preview')
    // Toggle show more, show less text upon clicking
    let txt = $postText.hasClass('post-preview') ? '...show more' : '...show less';
    $(this).text(txt)
  }
}

let topicShow = new makeTopicShow()
module.exports = topicShow

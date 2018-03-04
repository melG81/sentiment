let makeCommentSingle = function () {
  this.init = () => {
    this.cacheDom()
    this.bindEvents()
  }
  this.cacheDom = () => {
    this.$commentReply = $('.comment-reply')
  }
  this.bindEvents = () => {
    this.$commentReply.on('click', this.toggleForm)
  }
  this.toggleForm = (e) => {
    // Toggle nearest reply form
    let $target = $(e.target)
    let $commentReplyForm = $target.next('.comment-reply-form')
    $commentReplyForm.toggleClass('hide')
  }
}

let commentSingle = new makeCommentSingle()
module.exports = commentSingle
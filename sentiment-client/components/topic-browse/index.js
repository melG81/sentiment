let makeBrowseForm = function () {
  this.init = () => {
    this.cacheDom()
    this.bindEvents()
  }
  this.cacheDom = () => {
    this.$submit = $('.topic-browse-submit')
    this.$keywords = $('.topic-browse-keyword option:selected').map(function(){
      return $(this).val()
    }).splice(0)
    this.$days = $('.topic-browse-days').find(':selected').val()
  }
  this.bindEvents = () => {
    this.$submit.on('click', this.redirect)
  }
  this.redirect = (e) => {
    e.preventDefault()
    this.cacheDom()
    let topicArr = this.$keywords
    let daysAgo = this.$days
    let topicQuery = topicArr.map(topic => encodeURI(topic)).join('&topic=')
    let pathName = `/topics/browse?topic=${topicQuery}&daysAgo=${daysAgo}`
    window.location.replace(location.origin + pathName)
  }
}

let browseForm = new makeBrowseForm()
module.exports = browseForm

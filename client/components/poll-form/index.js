// Dependencies
let axios = require('axios');

let makePollForm = function () {
  this.message = 'Click poll results to start'
  this.init = () => {
    this.cacheDom()
    this.bindEvents()
    this.render()
  }
  this.cacheDom = () => {
    this.$submit = $('.poll-form-submit')
    this.$results = $('.poll-form-results')
    this.$keyword = $('.poll-form-keyword').find(':selected').val()
    this.$days = $('.poll-form-days').find(':selected').val()
  }
  this.bindEvents = () => {
    this.$submit.on('click', this.pollForm)
  }
  this.setMessage = (string) => {
    this.message = string
    this.render()
  }
  this.pollForm = (e) => {
    e.preventDefault()
    this.cacheDom()
    let query = this.$keyword
    let daysAgo = this.$days
    this.setMessage('...polling')
    axios.post('/topics/pollscript', {query, daysAgo})
      .then(payload => {
        this.setMessage(payload.data)
      })
  }
  this.render = () => {
    this.$results.text(this.message)
  }
}

let pollForm = new makePollForm()
module.exports = pollForm

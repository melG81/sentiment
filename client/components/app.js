// Main styles, load first not inline with JS
require('./styles/main.scss')

// Dependencies
let topicShow = require('./topic-show/index.js')
let pollForm = require('./poll-form/index.js')
let browseForm = require('./topic-browse/index.js')
let tickerPrices = require('./ticker-prices/index.js')
let commentSingle = require('./comment/comment-single/index.js')
// Lazy loading jquery plugin
// require('./lazy-load/index.js')()

topicShow.init()
pollForm.init()
browseForm.init()
tickerPrices.init()
commentSingle.init()


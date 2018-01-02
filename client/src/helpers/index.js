let helpers = module.exports = {}

helpers.add = require('./add')
helpers.capitalize = require('./capitalize')
helpers.encodeDasherize = require('./encodeDasherize')
helpers.eq = require('./eq')
helpers.join = require('./join')
helpers.modulo = require('./modulo')
helpers.moment = require('./moment')
helpers.momentFromNow = require('./momentFromNow')
helpers.numeral = require('./numeral')
helpers.parseHtml = require('./parseHtml')
helpers.round = require('./round')
helpers.sentimentColor = require('./sentimentColor')
helpers.tickerColor = require('./tickerColor')
helpers.times = require('./times')
helpers.truncate = require('./truncate')

// // Font-Awesome 5
// let fontawesome = require('@fortawesome/fontawesome');
// let solid = require('@fortawesome/fontawesome-free-solid');
// let brands = require('@fortawesome/fontawesome-free-brands');

// // Adds all the icons from the Solid style into our library for easy lookup
// fontawesome.library.add(solid, brands)

// helpers.fontawesomeCSS = function () {
//   return fontawesome.dom.css()
// }

// helpers.fontawesomeIcon = function (args) {
//   return fontawesome.icon({ prefix: 'fas', iconName: args.hash.icon }).html
// }

// helpers.fontawesomeBrand = function (args) {
//   return fontawesome.icon({ prefix: 'fab', iconName: args.hash.icon }).html
// }
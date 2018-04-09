let static = module.exports = {}

static.resources = function(req, res, next) {
  res.render('static/resources')
}

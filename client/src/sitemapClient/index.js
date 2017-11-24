var sm = require('sitemap');
var config = require('../../config.js')

var sitemapClient = function (data) {
  return sm.createSitemap({
    hostname: config.host,
    cacheTime: 600000,
    urls: data
  });
};

module.exports = sitemapClient

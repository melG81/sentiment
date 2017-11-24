// Dependencies
let sitemapClient = require('../src/sitemapClient')
let dbClient = require('../src/util/dbClient')
let keywords = require('../src/filters/queryKeywords')

let sitemap = module.exports = {}


let transformSitemap = function(data) {
  return data.map(el => {
    return {
      url: `topics/news/${el.post.title.replace(/[^a-zA-Z0-9]/g, "-")}/${el._id}`,
      changefreq: 'weekly'
    }
  })  
}

sitemap.index = function(req, res, next) {
  dbClient.getByTopics(keywords,10)
    .then(payload => {
      let data = payload.data
      let sitemapMeta = transformSitemap(data)
      sitemapClient(sitemapMeta).toXML((err, xml) => {
        if (err) {
          return res.status(500).end()
        }
        res.header('Content-Type', 'application/xml');
        res.send(xml);
      })
    })
}
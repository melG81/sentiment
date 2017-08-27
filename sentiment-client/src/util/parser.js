let parser = module.exports = {};

parser.parsePost = function(data){
  let thread = data.thread || {};  
  
  return Object.assign({},{
    site: thread.site,
    url: data.url,
    author: data.author,
    published: data.published,
    title: data.title,
    text: data.text,
    crawled: data.crawled
  })
}



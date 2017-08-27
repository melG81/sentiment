let parser = module.exports = {};

/**
 * @function {parses single post object to extract relevant metadata }
 * @param  {Object} data {single post from webhose api payload}
 * @return {Object} {transformed object with extracted data}
 */
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



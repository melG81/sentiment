// Dependencies
let dompurify = require('dompurify');

// Use JSDOM to simulate window on serverside
if (typeof window === 'undefined') {
  let { JSDOM } = require('jsdom');
  let window = (new JSDOM('')).window;
  dompurify = dompurify(window);
}

module.exports = function (string) {
  // Replace new line break with with <br/>
  let dirty = string.replace(/\n/g, "<br/>");
  let clean = dompurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br']
  });
  return clean.trim()
}
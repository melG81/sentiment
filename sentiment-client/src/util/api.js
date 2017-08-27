let api = module.exports = {}

// Dependencies
let config = require('../../config.js');
let axios = require('axios');

// Refer to webhose API developer docs for filter and format query params
// https://docs.webhose.io/v1.0/docs/filters-reference
api.webhose = {  
  token: config.webhoseTOKEN,
  endpoint: "http://webhose.io/filterWebContent?token=",
  format: "sort=relevancy&size=100",
  filters: "q=language%3Aenglish%20site_type%3Anews%20is_first%3Atrue%20",
  buildURL: function(){
    return `${this.endpoint}${this.token}&${this.format}&${this.filters}`
  }
}

api.query = function (string) {
  let endpoint = api.webhose.buildURL();
  let queryParam = encodeURI(string);
  let url = endpoint + queryParam;
  return axios.get(url)
}

api.getNext = function (payload) {
  let data = payload.data;
  let isMore = data.moreResultsAvailable > 0;
  let next = data.next;
  let url = "http://webhose.io" + next;
  if (isMore) {
    return axios.get(url)
  } else {
    Promise.resolve('done');
  }
}
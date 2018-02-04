// ENV variables
require('dotenv').config({ path: __dirname + '/./../../.env' });

let User = module.exports = {}

// Dependencies
let config = require('../../config.js');
let axios = require('axios');

User.find = function (request = axios) {
  let url = `${config.sentimentDBHost}/users`;
  return request.get(url)
}

User.findByEmail = function (email, request = axios) {
  let url = `${config.sentimentDBHost}/users/email/${email}`;
  return request.get(url)
}

User.create = function (body, request = axios) {
  let {email, password, username, admin} = body
  let url = `${config.sentimentDBHost}/users`;
  return request.post(url, {email, password, username, admin})
}

User.delete = function (id, request = axios) {
  let url = `${config.sentimentDBHost}/users/${id}`;
  return request.delete(url)
}
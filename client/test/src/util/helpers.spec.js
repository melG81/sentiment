var chai = require('chai');
var expect = chai.expect;
var helpers = require('../../../src/util/helpers');

describe('#helpers', function () {
  it('should exist', () => expect(helpers).to.not.be.undefined);
  describe('truncate', function () {
    it('should exist', () => expect(helpers.truncate).to.not.be.undefined);
    it('should shorten a string based on number of characters given', () => {
      let string = 'this is a string mate and it is super long blah blah'
      let input = helpers.truncate(string, 17);
      let actual = 'this is a string ...';
      expect(input).to.equal(actual);
    })
  })
  describe('parse', function () {
    it('should parse a url query string', function(){
      let queryString = '/filterWebContent?token=da347ad6-b6b4-4135-839d-4308c3989db4&format=html&ts=1503567431774&q=bitcoin+language%3Aenglish+site_type%3Anews+is_first%3Atrue+&sort=relevancy&from=100'
      let input = helpers.parse(queryString, 'q').split(' ')[0];
      let actual = 'bitcoin';
      expect(input).to.equal(actual)
    })
  })
});
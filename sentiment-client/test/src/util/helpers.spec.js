var chai = require('chai');
var expect = chai.expect;
var helpers = require('../../../src/util/helpers');

describe('helpers', function () {
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
});
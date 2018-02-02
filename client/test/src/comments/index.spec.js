var chai = require('chai');
var expect = chai.expect;
var comments = require('../../../src/comments');
let util = require('util')

describe.only('#comments', function () {
  describe('flattenNested', function () {
    it('should create a nested array of comments and children replies recursively sorted by date created', () => {
      let commentRaw = require('../../data/comments/comment.json')
      let commentNested = require('../../data/comments/commentNested')
      
      let input = comments.flattenNested(commentRaw)
      // console.log(util.inspect(input, false, null));
      let actual = commentNested
      expect(input).to.eql(actual)
    })
  })
});
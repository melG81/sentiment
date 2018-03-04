var chai = require('chai');
var expect = chai.expect;
var comments = require('../../../src/comments');
let util = require('util')
let fs = require('fs')
let path = require('path')
const chaiHtml = require('chai-html')

chai.use(chaiHtml)


describe('#comments', function () {
  describe('flattenNested', function () {
    it('should create a nested array of comments and children replies recursively sorted by date created', () => {
      let commentRaw = require('../../data/comments/comment.json')
      let commentNested = require('../../data/comments/commentNested')

      let input = comments.flattenNested(commentRaw)
      // console.log(util.inspect(input, false, null));
      let actual = commentNested
      expect(input).to.eql(actual)
    })
    it('should work if there are no replies', () => {
      let commentRaw = require('../../data/comments/commentNoReply.json')
      let commentNested = require('../../data/comments/commentNoReplyNested')

      let input = comments.flattenNested(commentRaw)
      // console.log(util.inspect(input, false, null));
      let actual = commentNested
      expect(input).to.eql(actual)
    })
  })
});
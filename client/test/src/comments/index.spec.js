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
  })

  describe('parse', function (){
    it('should return html friendly and ordered comments and replies with relevant indenting', () => {
      let commentRaw = require('../../data/comments/comment.json')
      let html = fs.readFileSync(path.join(__dirname, '../../data/comments/commentHTML.html'), 'utf-8')

      let input = comments.parse(commentRaw)
      let actual = html
      expect(input).html.to.equal(actual)
    })
  })
});
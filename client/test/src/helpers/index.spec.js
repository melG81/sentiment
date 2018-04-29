var chai = require('chai');
var expect = chai.expect;
var helpers = require('../../../src/helpers');
let sinon = require('sinon');

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
  describe('parseHtml', function () {
    it('should parse utf text into html friendly string', function () {
      let raw = "<SCRIPT language='JavaScript1.1' SRC=\"https://ad.doubleclick.net/ddm/adj/N5872.2787608CRYPTOCOINSNEWS/B11469652.152841306;abr=!ie;sz=728x90;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=?\"> </SCRIPT> <NOSCRIPT> <A HREF=\"https://ad.doubleclick.net/ddm/jump/N5872.2787608CRYPTOCOINSNEWS/B11469652.152841306;abr=!ie4;abr=!ie5;sz=728x90;ord=[timestamp]?\"> <IMG SRC=\"https://ad.doubleclick.net/ddm/ad/N5872.2787608CRYPTOCOINSNEWS/B11469652.152841306;abr=!ie4;abr=!ie5;sz=728x90;ord=[timestamp];dc_lat=;dc_rdid=;tag_for_child_directed_treatment=?\" BORDER=0 WIDTH=728 HEIGHT=90 ALT=\"Advertisement\"></A> </NOSCRIPT> Get Trading Recommendations and Read Analysis on Hacked.com for just $39 per month. \nBlockchain startup Dragonchain has concluded a $15 million initial coin offering (ICO) for its enterprise blockchain platform that originally began as a prototype at Disney’s innovation-focused Seattle office. \nDisney had originally conceived Dragonchain in 2014 as a blockchain-based asset management platform, but two years later it shelved the project and released it as open source software. Earlier this year, a group of former Disney employees resurrected the project and decided to raise funds through a utility token crowdsale that ran from October 2 to November 2. \nThe startup had already raised $1.4 million during a presale for its dragon tokens (DRGN), and it added approximately $13.7 billion during its public ICO, bringing its fundraising total to near $15.1 million. \nAs explained on the project website , the Dragonchain platform is a hybrid public-private blockchain solution that enables companies to maintain full control over sensitive internal data while also serving as a bridge to bitcoin and other public blockchains."
      let input = helpers.parseHtml(raw)
      let actual = "Get Trading Recommendations and Read Analysis on Hacked.com for just $39 per month. <br>Blockchain startup Dragonchain has concluded a $15 million initial coin offering (ICO) for its enterprise blockchain platform that originally began as a prototype at Disney’s innovation-focused Seattle office. <br>Disney had originally conceived Dragonchain in 2014 as a blockchain-based asset management platform, but two years later it shelved the project and released it as open source software. Earlier this year, a group of former Disney employees resurrected the project and decided to raise funds through a utility token crowdsale that ran from October 2 to November 2. <br>The startup had already raised $1.4 million during a presale for its dragon tokens (DRGN), and it added approximately $13.7 billion during its public ICO, bringing its fundraising total to near $15.1 million. <br>As explained on the project website , the Dragonchain platform is a hybrid public-private blockchain solution that enables companies to maintain full control over sensitive internal data while also serving as a bridge to bitcoin and other public blockchains."
      expect(input).to.equal(actual)
    })
  })
  describe('moment', function () {
    it('should format date correctly', function () {
      let date = new Date('2017-02-01')
      let input = helpers.moment(date, 'YYYY-MM-DD')
      let actual = '2017-02-01'
      expect(input).to.equal(actual)
    })
  })
  describe('momentFromNow', function () {
    it('should format from dates correctly', function () {
      let date = new Date()
      let yesterday = new Date(date - 1000 * 60 * 60 * 24 * 1)
      let input = helpers.momentFromNow(yesterday)
      let actual = 'a day ago'
      expect(input).to.equal(actual)
    })
  })
  describe.only('scoreEmoji', function () {
    it('should show relevant emoji face for appropriate score number', function () {
      let scoreArr = [0.8, "0.5", 0.1, -0.2, "-0.6", -1.0]      
      let input = scoreArr.map(num => helpers.scoreEmoji(num));
      let actual = ["😀", "🙂", "😐", "😐", "😟", "😡"]
      
      expect(input).to.eql(actual)
    })
    it('should return "N/A" if not a number', function () {
      let score = "Banana"
      let input = helpers.scoreEmoji(score)
      let actual = "N/A"

      expect(input).to.equal(actual)
    })
  })
});
var chai = require('chai');
var expect = chai.expect;
var parser = require('../../../src/util/parser');
let helpers = require('../../../src/util/helpers')

// Require sample json data
let bitcoinPage1 = require('../../data/bitcoinPage1.json');
let post = require('../../data/post.json');
let postNew = {
  uuid: "521fec8ebfe03a792096b1ef97a8ff3668e0c442",
  site: "businessinsider.com",
  url: "http://omgili.com/ri/jHIAmI4hxg8v3BmVd24meuL1ei1Bo_4WrVcnnQA4rPU43VUr.1EFLsENOYNWqEvk5MVa7jmgM_OhhMLDLxgyaU7BC11G.3OGANlGoyIde1C5c9x5Jrbk6dVCK_t_GbZN",
  author: "Frank Chaparro , Business Insider US",
  published: "2017-08-24T23:34:00.000+03:00",
  title: "Bitcoin miners are making a killing in transaction fees",
  text: helpers.truncate("Bitcoin miners are making a killing in transaction fees Bitcoin miners are making a killing in transaction fees By FILE PHOTO – A Bitcoin sign is seen in a window in Toronto source Thomson Reuters \nBitcoin miners are making money hand-over-fist. \nAccording to data from blockchain.info.com , the value of transaction fees paid to miners has reached an all-time high of $2.3 million. \nMiners are basically the hamsters in the wheel that keep bitcoin’s network going. They use rigs of computers to unlock the blocks (underpinning bitcoin’s network) on which transactions are made. Every time a miner unlocks a bitcoin block, vis-a-vis mining, all the transactions on that block are processed. The miner, in return for his hard work, is rewarded with 12.5 bitcoins for unlocking the block. They also get to keep the transaction fees bitcoin holders pay when they transact with the cryptocurrency. \nIn the early days, miners would only get a couple bucks in transaction fees. On Wednesday, however, miners received a whopping $2.3 million. \n“That’s on top of the millions of dollars they received in their bitcoin rewards,” according to Aaron Lasher, the chief marketing officer at Breadwallet. He estimates miners, in total, were rewarded with 1,800 bitcoins, or $7 million. \n“That’s going to about five to 10 companies,” Lasher said. But he says the exact number is hard to pinpoint. \nSince more people are using bitcoin, the demand to make a transaction has gone up. As such, the price to get to the front of the line has gone up. \n“I just made a transaction this morning,” Lasher said.”It cost me $25.” \nThat’s on par with the average wire transfer fee. Still, it’s a far cry from the pennies it cost to send bitcoin back in its earliest days. caption Transaction fees have been on a tear since August 5, a few days after Bitcoin split in two. source Blockchaininfo.com \nTransaction fees have whipped around, in line with the uncertainty underpinning the cryptocurrency space. Transaction fees slid from late May to early August from about $1.7 million on June 6 to a bottom of $205,000 on July 31. \nAaron says this dip was likely the result of a decline in bitcoin transactions leading up to the fork, which split bitcoin into two different digital currencies : bitcoin and bitcoin cash. \n“Once the fork completed on August 1, people began using bitcoin again,” Lasher said. “But now that Segwit has activated, we should see some easing over the coming weeks and months.” \nSegwit is an update to bitcoin’s software that was agreed to by the cryptocurrency’s powerbrokers in order to address the scaling problem that it faces. Segwit proponents hope the update will make the network faster and in turn bring down those pesky fees. \nJosh Olszewicz, a bitcoin trader, told Business Insider that bitcoin cash may be the culprit. \nAccording to Olszewicz, some bitcoin miners moved over to bitcoin cash, thus lowering the network’s hash rate (HR). In other words, there were fewer hamsters in the wheel. \n“HR moved to bitcoin cash temporarily,” Olszewicz said.”As a result, confirm times spiked to over 15 minutes.” TAGS", 600),
  crawled: "2017-08-25T00:07:35.000+03:00"
}

describe('#parser', function(){
  it('should exist', () => expect(parser).to.not.be.undefined)
  describe('.parsePost', function(){
    it('should exist', () => expect(parser.parsePost).to.not.be.undefined)
    it('should extract relevant properties from a single post object', function(){
      let input = parser.parsePost(post);
      let actual = postNew
      expect(input).to.eql(actual);
    })
  });
  describe('.parseArray', function () {
    it('should exist', () => expect(parser.parseArray).to.not.be.undefined)
    it('should parse an array of posts and return transformed posts', function () {
      let posts = bitcoinPage1.posts;
      let input = parser.parseArray(posts);
      let actual = postNew;
      expect(input.length).to.equal(100);
      expect(input[0]).to.eql(actual);      
    })
  });
  
})

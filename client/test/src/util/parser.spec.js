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
  text: helpers.truncate("Bitcoin miners are making a killing in transaction fees Bitcoin miners are making a killing in transaction fees By FILE PHOTO – A Bitcoin sign is seen in a window in Toronto source Thomson Reuters \nBitcoin miners are making money hand-over-fist. \nAccording to data from blockchain.info.com , the value of transaction fees paid to miners has reached an all-time high of $2.3 million. \nMiners are basically the hamsters in the wheel that keep bitcoin’s network going. They use rigs of computers to unlock the blocks (underpinning bitcoin’s network) on which transactions are made. Every time a miner unlocks a bitcoin block, vis-a-vis mining, all the transactions on that block are processed. The miner, in return for his hard work, is rewarded with 12.5 bitcoins for unlocking the block. They also get to keep the transaction fees bitcoin holders pay when they transact with the cryptocurrency. \nIn the early days, miners would only get a couple bucks in transaction fees. On Wednesday, however, miners received a whopping $2.3 million. \n“That’s on top of the millions of dollars they received in their bitcoin rewards,” according to Aaron Lasher, the chief marketing officer at Breadwallet. He estimates miners, in total, were rewarded with 1,800 bitcoins, or $7 million. \n“That’s going to about five to 10 companies,” Lasher said. But he says the exact number is hard to pinpoint. \nSince more people are using bitcoin, the demand to make a transaction has gone up. As such, the price to get to the front of the line has gone up. \n“I just made a transaction this morning,” Lasher said.”It cost me $25.” \nThat’s on par with the average wire transfer fee. Still, it’s a far cry from the pennies it cost to send bitcoin back in its earliest days. caption Transaction fees have been on a tear since August 5, a few days after Bitcoin split in two. source Blockchaininfo.com \nTransaction fees have whipped around, in line with the uncertainty underpinning the cryptocurrency space. Transaction fees slid from late May to early August from about $1.7 million on June 6 to a bottom of $205,000 on July 31. \nAaron says this dip was likely the result of a decline in bitcoin transactions leading up to the fork, which split bitcoin into two different digital currencies : bitcoin and bitcoin cash. \n“Once the fork completed on August 1, people began using bitcoin again,” Lasher said. “But now that Segwit has activated, we should see some easing over the coming weeks and months.” \nSegwit is an update to bitcoin’s software that was agreed to by the cryptocurrency’s powerbrokers in order to address the scaling problem that it faces. Segwit proponents hope the update will make the network faster and in turn bring down those pesky fees. \nJosh Olszewicz, a bitcoin trader, told Business Insider that bitcoin cash may be the culprit. \nAccording to Olszewicz, some bitcoin miners moved over to bitcoin cash, thus lowering the network’s hash rate (HR). In other words, there were fewer hamsters in the wheel. \n“HR moved to bitcoin cash temporarily,” Olszewicz said.”As a result, confirm times spiked to over 15 minutes.” TAGS", 5000),
  crawled: "2017-08-25T00:07:35.000+03:00",
  domainRank: 283,
  mainImage: "http://static.businessinsider.my/sites/3/2017/08/599f251b289cc637008b581f.jpg",
  social: {
    facebook: {
      likes: 1203,
      comments: 0,
      shares: 1203
    },
    gplus: {
      shares: 0
    },
    pinterest: {
      shares: 0
    },
    linkedin: {
      shares: 35
    },
    stumbledupon: {
      shares: 0
    },
    vk: {
      shares: 0
    }
  }
}
let postDiscussion = require('../../data/bitcoinDiscussion.json').posts[0]
let postNewDiscussion = {
  uuid: 'bca66ca27ea0e7b97b4fc06674ebc183091c00b9',
  site: 'reddit.com',
  url: 'http://omgili.com/ri/.wHSUbtEfZQ2F8au4ugZad_J4qnGXapSb6YSL21UuCC9QPfwa1nB9HlE2GRh2hqaqOn4N1N1cC5hZUjyoZsmJX5AmyVch8NNV9D2Zu5wIeIRRWRnyrDp_R2ObTK3FyiA',
  author: 'keygen4ever',
  published: '2017-11-21T11:34:00.000+02:00',
  title: 'Tether Critical Announcement',
  crawled: '2017-11-21T07:21:16.004+02:00',
  text: "https://tether.to/tether-critical-announcement/\nTether Critical Announcement\nYesterday, we discovered that funds were improperly removed from the Tether treasury wallet through malicious action by an external attacker. Tether integrators must take immediate action, as discussed below, to prevent further ecosystem disruption.\n$30,950,010 USDT was removed from the Tether Treasury wallet on November 19, 2017 and sent to an unauthorized bitcoin address. As Tether is the issuer of the USDT managed asset, we will not redeem any of the stolen tokens, and we are in the process of attempting token recovery to prevent them from entering the broader ecosystem. The attacker is holding funds in the following address: 16tg2RJuEPtZooy18Wxn2me2RhUdC94N7r. If you receive any USDT tokens from the above address, or from any downstream address that receives these tokens, do not accept them, as they have been flagged and will not be redeemable by Tether for USD.\nThe following steps have been taken to address this matter:\nThe tether.to back-end wallet service has been temporarily suspended. A thorough investigation on the cause of the attack is being undertaken to prevent similar actions in the future. We are providing new builds of Omni Core to the community. (Omni Core is the software used by Tether integrators to support Omni Layer transactions.) These builds should prevent any movement of the stolen coins from the attacker’s address. We strongly urge all Tether integrators to install this software immediately to prevent the coins from entering the ecosystem. Again, any tokens from the attacker’s address will not be redeemed. Accordingly, any and all exchanges, wallets, and other Tether integrators should install this software immediately in order to prevent loss:\nhttps://github.com/tetherto/omnicore/releases/tag/0.2.99.s\nNote that this software will cause a consensus change to currently running Omni Core clients, meaning that it is effectively a temporary hard fork to the Omni Layer. Integrators running this build will not accept any token sends from the attacker’s address, preventing the coins from moving further from the attacker’s address. We are working with the Omni Foundation to investigate ways that will allow Tether to reclaim stranded tokens and rectify the hard fork created by the above software. Once this protocol enhancement is complete, the Omni Foundation will provide updated binaries for all integrators to install. These builds will supersede the binaries provided above by Tether.to. After the protocol upgrades to the Omni Layer are in place, Tether will reclaim the stolen tokens and return them to treasury. Tether issuances have not been affected by this attack, and all Tether tokens remain fully backed by assets in the Tether reserve. The only tokens that will not be redeemed are the ones that were stolen from Tether treasury yesterday. Those tokens will be returned to treasury once the Omni Layer protocol enhancements are in place.\nWe will provide further updates as they come available, and we appreciate the community’s patience, understanding, and support while we work to rectify the situation in the best possible manner to everyone’s benefit.\nThe Tether Team\n submitted by /u/keygen4ever\n[link] [comments]...",
  domainRank: 33,
  mainImage: '',
  social: {
    facebook: {
      likes: 0,
      comments: 0,
      shares: 0
    },
    gplus: {
      shares: 0
    },
    pinterest: {
      shares: 0
    },
    linkedin: {
      shares: 0
    },
    stumbledupon: {
      shares: 0
    },
    vk: {
      shares: 0
    }
  }
}

describe('#parser', function(){
  it('should exist', () => expect(parser).to.not.be.undefined)
  describe('.parsePost', function(){
    it('should exist', () => expect(parser.parsePost).to.not.be.undefined)
    it('should extract relevant properties from a single news post object', function(){
      let input = parser.parsePost(post);
      let actual = postNew
      expect(input).to.eql(actual);
    })
    it('should do the same for a single discussions post object', function(){
      let input = parser.parsePost(postDiscussion);
      let actual = postNewDiscussion
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

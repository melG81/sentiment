let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon')
let google = require('../../../src/util/google');
let dbClient = require('../../../src/util/dbClient')

describe('#google', () => {
  describe('.analyze', () => {
    it('should exist', () => expect(google.analyze).to.not.be.undefined)
    it('should analyze title and text and return documentSentiment', (done) => {
      let text = "Uncle Sam has Bitcoin traders on the radar these days, as the cryptocurrency passes $4,300 in late August trading.\nWith more assets pouring into digital currencies, the federal government, via the Internal Revenue Service , is looking to get its fair share from Bitcoin -- a cut that the IRS doesn't believe it's been getting until now.\nThat could change, and fast, as the IRS is using a software program that monitors Bitcoin-based digital addresses, in a campaign to identify potential tax evaders.\nUsing a customized software program from Chainalysis, a blockchain data analysis firm in New York City, the IRS expects to extract more intelligence -- and potentially more fraud -- from virtual currency movements through the blockchain and centralized currency exchanges. Chainalysis says it's able to track approximately 50% of all Bitcoin activity, and 4 million additional Bitcoin addresses, more than enough to get an accurate gauge on who's hiding cash from the IRS.\nAre you investing in cryptocurrency ? Don't miss TheStreet's coverage:\nWhy Bitcoin Cash Prices Are Likely to Dive Again Forget IPOs: How Do Companies Know If an ICO Is Right for Them? Bitcoin to Take Over Civilization How Cryptocurrency Mining Works Explains Why AMD and Nvidia's Sales to Miners Might Soon Fall Bitcoin Mania Setting Up for Greatest Financial Crash in 400 Years Bitcoin Surges to Record Price Despite Technology Debate Bitcoin Investors Must Report Gains to the IRS \"The IRS is under pressure to increase compliance in digital coin tax reporting based on an audit done by the US inspector general, and has taken other steps to identify unreported digital currency transactions such as a John Doe request of Coinbase and a survey of filed returns,\" explains Randy Tarpey, a digital currency tax specialist at Sickler Tarpey & Associates, in Tyrone, Pa.\nWith no third-party tax reporting to the IRS currently available, the agency has no automatic way to enforce or encourage tax reporting compliance other than 1099-K reporting which only covers a few taxpayers, Tarpey says. \"While taxpayers can initially avoid reporting digital coin transactions the blockchain is public, and once enforcement begins, transactions are easily obtained,\" he notes.\nThe nature of Bitcoin makes it difficult to track in some respects, says Dean Anastos, CEO at Blockchain Developers in New York City.\nBitcoin.\n\"Bitcoin itself is based on technology that makes its ledger public,\" Anastos says. \"Essentially all the transactions taking place within its infrastructure is viewable by anyone analyzing the blockchain.\"\nBut what's not so easily identifiable is the user themselves, he says.\n\"However, the IRS would always have the capability to track the transactions to a possible point of sale where the delivery of a product or service has taken place for the particular Bitcoin user being scrutinized,\" Anastos explains. \"But this particular strategy doesn't work well with Bitcoin users who are able to make use of something called tumblers - blockchain services that obfuscate the source of transactions by mixing them up with other transactions, making it difficult to trace transactions.\"\nBig Investors Are Taking Issue With Hong Kong's Dual-Class Share Proposal \"The promise of cryptocurrency was a paperless, transparent, but anonymous way of conducting financial transactions,\" states Norm Pattis, a best-selling legal author and a cryptocurrency specialist. \"Needless to say, taxing authorities find that threatening, and the regulatory net is tightening.\"\nBitcoin is regarded as property and not a currency by the IRS, Pattis explains. \"As property, it is taxable as a capital gain when converted into cash or a cash equivalent,\" he says. \"Given Bitcoin's volatility, determining the tax basis will be a headache for those who dip in and out of the Bitcoin market.\"\nAs Bitcoin becomes more popular and is trusted as a medium of exchange, the federal government will no doubt come to regard it as income, Pattis adds. \"Nothing of value lies beyond the grip of the taxman for long,\" he says. \"The whining you hear coming from your computer is Bitcoin gasping for breath as the taxman squeezes.\"\nThere are ways to avoid the taxman, Pattis says. \"While tracing IP addresses will snare the causal user of Bitcoin, those determined to cover their tracks can use scrambling devices and the dark net to evade detection,\" he says.\nThe Bitcoin exchanges can provide more transparency to thwart fraudulent activity, Tarpey says, and help keep the Bitcoin market clear of tax cheats.\n\"Bitcoin is typically taxed as property and reported annually on Schedule D as capital gain or loss when Bitcoin is cashed in,\" he states. \"Bitcoin that is not cashed is not taxed until the gain or loss is realized. Miner Bitcoins are taxed as business revenue when transferred to the miner.\"\nBut exchanges could and should report gains or losses on IRS Form 1099-B, just like stocks and bonds. \"This small change would assist taxpayers to comply with tax law they may be unintentional overlooking,\" Tarpey adds.\n\"Digital currency is growing rapidly and has many valid uses and avid supporters. Tax filing for digital currency needs to be improved for everyone's benefit,\" Tarpey says.\nMore of What's Trending on TheStreet :\n10 Mind-Blowing Things That Amazon Might Do to Whole Foods Sears Is Closing a Ton More Stores Because Let's Face It, It's Sears Here Are 3 Things to Do After a $750 Million Powerball Win Gibson Guitar May Default If Company Can't Refinance Its Debt Wells Fargo Is in a Correction -- This Is What You Should Do"
      let actual = {
        documentSentiment: {
          magnitude: 0.8999999761581421,
          score: -0.8999999761581421
        }
      }
      let fakeClient = {
        analyzeSentiment() {
          return Promise.resolve(actual)
        }
      }
      google.analyze(text, fakeClient).then(result => {
        expect(result).to.eql(actual)
        done()
      })
    })
  })
  describe('.postUpdateSentiment', () => {
    it('should analyze title sentiment and update document', (done) => {
      let document = {
        topic: ['bitcoin'],
        _id: 'uid',
        post: {
          title: 'this is the title',
          text: 'this is the copy text'
        }
      }
      let sentiment = {
        documentSentiment: {
          magnitude: 0.8999999761581421,
          score: -0.8999999761581421
        }        
      }
      let newDoc = {
        topic: ['bitcoin'],
        _id: 'uid',
        post: {
          title: 'this is the title',
          text: 'this is the copy text'
        },
        documentSentiment: sentiment.documentSentiment        
      }

      let analyzeStub = sinon.stub(google, 'analyze').returns(Promise.resolve(sentiment))
      let updateThreadStub = sinon.stub(dbClient, 'updateThread').returns(Promise.resolve(newDoc))

      google.postUpdateSentiment(document).then(result => {
        let input = result
        let actual = newDoc        
        expect(input).to.eql(actual)
        expect(updateThreadStub.calledWith('uid', newDoc)).to.be.true
        expect(updateThreadStub.callCount).to.equal(1)

        analyzeStub.restore();
        updateThreadStub.restore();
        done();
      })
      
    })
    it('should only analyze if property documentSentiment does not exist', (done) => {
      let document = {
        topic: ['bitcoin'],
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: 'uid',
        post: {
          title: 'this is the title',
          text: 'this is the copy text'
        },
        documentSentiment: {
          magnitude: 0.8999999761581421,
          score: -0.8999999761581421
        }
      }
      
      google.postUpdateSentiment(document).then(result => {
        let input = result
        let actual = 'Sentiment already exists'
        expect(input).to.eql(actual)
        done();
      })
    })
  })
})
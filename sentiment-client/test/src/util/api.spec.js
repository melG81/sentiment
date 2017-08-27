var chai = require('chai');
var expect = chai.expect;
var api = require('../../../src/util/api');
var axios = require('axios');
let sinon = require('sinon');

// Require sample json data
let bitcoinPage1 = require('../../data/bitcoinPage1.json');
let bitcoinPage2 = require('../../data/bitcoinPage2.json');
let bitcoinPage3 = require('../../data/bitcoinPage3.json');

describe('api', function () {
  it('should exist', () => expect(api).to.not.be.undefined);
  describe('query', function () {
    it('should exist', () => expect(api.query).to.not.be.undefined);
    it('should return a payload from api when given a valid query', function(done){
      let payload = {
        data: bitcoinPage1
      }
      let stub = sinon.stub(axios, 'get').returns(Promise.resolve(payload));
      api.query('bitcoin')
        .then(data => {
          expect(data).to.eql(payload)
          stub.restore();
          done();
        })
    })
  });
  describe('getNext', function(){
    it('should exist', () => expect(api.getNext).to.not.be.undefined);
    it('should fetch the next URL if there are still more results available', function(done){
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      let stub = sinon.stub(axios, 'get');
      stub.onFirstCall().returns(Promise.resolve(payload1));
      stub.onSecondCall().returns(Promise.resolve(payload2));
      api.query('bitcoin')
        .then(data => {
          expect(data).to.eql(payload1)
          return data
        })
        .then(data => api.getNext(data))
        .then(data => {
          expect(data).to.eql(payload2)
          stub.restore();
          done();
        })
    });
    it('should keep fetching the next URL until there are no more results available', function(done){
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      let payload3 = { data: bitcoinPage3 }
      let stub = sinon.stub(axios, 'get');
      stub.onFirstCall().returns(Promise.resolve(payload1));
      stub.onSecondCall().returns(Promise.resolve(payload2));
      stub.onThirdCall().returns(Promise.resolve(payload3));

      api.query('bitcoin')
        .then(data => {
          expect(data).to.eql(payload1)
          return data
        })
        .then(data => api.getNext(data))
        .then(data => {
          expect(data).to.eql(payload2)
          return data
        })
        .then(data => api.getNext(data))
        .then(data => {
          expect(data).to.eql(payload3)
          return data;
        })
        .then(data => api.getNext(data))
        .catch(err => {
          let input = err;
          let actual = 'No more results';
          expect(input).to.equal(actual);
          stub.restore();
          done();
        })      

        // let getMultiple = function(data){
      //   return api.getNext(data).then( data => {
      //     return data;
      //   })
      // };

      // let poll = function(data) {
      //   return getMultiple(data).then(data => {
      //     return poll(data);
      //   })        
      // }
      // api.query('bitcoin')
      //   .then(data => {
      //     return poll(data);
      //   })
      //   .catch(err => {
      //     let input = err;
      //     let actual = 'No more results';
      //     expect(input).to.equal(actual);
      //     expect(stub.callCount).to.equal(3);
      //     stub.restore();
      //     done();
      //   })      

    })
  });
  describe('pollNext', function () {
    it('should exist', () => expect(api.pollNext).to.not.be.undefined);
    it('should continue fetching next payload until there are no more results available', function (done) {
      let payload1 = { data: bitcoinPage1 }
      let payload2 = { data: bitcoinPage2 }
      let payload3 = { data: bitcoinPage3 }
      let stub = sinon.stub(axios, 'get');
      stub.onFirstCall().returns(Promise.resolve(payload1));
      stub.onSecondCall().returns(Promise.resolve(payload2));
      stub.onThirdCall().returns(Promise.resolve(payload3));

      api.query('bitcoin')
        .then(data => {
          return api.pollNext(data);
        })
        .catch(err => {
          let input = err;
          let actual = 'No more results';
          expect(input).to.equal(actual);
          expect(stub.callCount).to.equal(3);
          stub.restore();
          done();
        })      

    })
  });
  describe.only('postThread', function() {
    it('should exist', () => expect(api.postThread).to.not.be.undefined);
    it('should send a /POST request to sentiment-db and return the saved payload', function(done){
      let post = {
        site: "businessinsider.com",
        url: "http://omgili.com/ri/jHIAmI4hxg8v3BmVd24meuL1ei1Bo_4WrVcnnQA4rPU43VUr.1EFLsENOYNWqEvk5MVa7jmgM_OhhMLDLxgyaU7BC11G.3OGANlGoyIde1C5c9x5Jrbk6dVCK_t_GbZN",
        author: "Frank Chaparro , Business Insider US",
        published: "2017-08-24T23:34:00.000+03:00",
        title: "Bitcoin miners are making a killing in transaction fees",
        text: "Bitcoin miners are making a killing in transaction fees Bitcoin miners are making a killing in transaction fees By FILE PHOTO – A Bitcoin sign is seen in a window in Toronto source Thomson Reuters \nBitcoin miners are making money hand-over-fist. \nAccording to data from blockchain.info.com , the value of transaction fees paid to miners has reached an all-time high of $2.3 million. \nMiners are basically the hamsters in the wheel that keep bitcoin’s network going. They use rigs of computers to unlock the blocks (underpinning bitcoin’s network) on which transactions are made. Every time a miner unlocks a bitcoin block, vis-a-vis mining, all the transactions on that block are processed. The miner, in return for his hard work, is rewarded with 12.5 bitcoins for unlocking the block. They also get to keep the transaction fees bitcoin holders pay when they transact with the cryptocurrency. \nIn the early days, miners would only get a couple bucks in transaction fees. On Wednesday, however, miners received a whopping $2.3 million. \n“That’s on top of the millions of dollars they received in their bitcoin rewards,” according to Aaron Lasher, the chief marketing officer at Breadwallet. He estimates miners, in total, were rewarded with 1,800 bitcoins, or $7 million. \n“That’s going to about five to 10 companies,” Lasher said. But he says the exact number is hard to pinpoint. \nSince more people are using bitcoin, the demand to make a transaction has gone up. As such, the price to get to the front of the line has gone up. \n“I just made a transaction this morning,” Lasher said.”It cost me $25.” \nThat’s on par with the average wire transfer fee. Still, it’s a far cry from the pennies it cost to send bitcoin back in its earliest days. caption Transaction fees have been on a tear since August 5, a few days after Bitcoin split in two. source Blockchaininfo.com \nTransaction fees have whipped around, in line with the uncertainty underpinning the cryptocurrency space. Transaction fees slid from late May to early August from about $1.7 million on June 6 to a bottom of $205,000 on July 31. \nAaron says this dip was likely the result of a decline in bitcoin transactions leading up to the fork, which split bitcoin into two different digital currencies : bitcoin and bitcoin cash. \n“Once the fork completed on August 1, people began using bitcoin again,” Lasher said. “But now that Segwit has activated, we should see some easing over the coming weeks and months.” \nSegwit is an update to bitcoin’s software that was agreed to by the cryptocurrency’s powerbrokers in order to address the scaling problem that it faces. Segwit proponents hope the update will make the network faster and in turn bring down those pesky fees. \nJosh Olszewicz, a bitcoin trader, told Business Insider that bitcoin cash may be the culprit. \nAccording to Olszewicz, some bitcoin miners moved over to bitcoin cash, thus lowering the network’s hash rate (HR). In other words, there were fewer hamsters in the wheel. \n“HR moved to bitcoin cash temporarily,” Olszewicz said.”As a result, confirm times spiked to over 15 minutes.” TAGS",
        crawled: "2017-08-25T00:07:35.000+03:00"
      }      
      let postNew = Object.assign(post, {
        topic: 'bitcoin',
        createdAt: new Date(),
        updatedAt: new Date(),
        _id: 'uid'
      })
      
      let stub = sinon.stub(axios,'post').returns(Promise.resolve(postNew))
      api.postThread('bitcoin', post)
        .then(data => {
          expect(data).to.eql(postNew);       
          stub.restore();
          done();
        })
    })
  })
});


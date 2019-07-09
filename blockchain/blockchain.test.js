const Blockchain = require('../blockchain/blockchain');
const Block = require('../blockchain/block');
const cryptoHash = require('../util/crypto-hash.js');
const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

describe('Blockchain', () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  })

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'rye bread';
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {

    describe('when the block does not start with the genesis block', () => {
      it('returns false', () => {
        blockchain.chain[0] = { data: 'fake-genisis'};
        expect(Blockchain.isValidChain(blockchain)).toBe(false);
      });
    });
    describe('when the chain starts with the genisis block and has multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'Bears' });
        blockchain.addBlock({ data: 'Beets' });
        blockchain.addBlock({ data: 'Battlestar Galactica' });
      })
      describe('and a lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.chain[2].lastHash = 'broken-lastHash';
          expect(Blockchain.isValidChain(blockchain)).toBe(false);
        });
      });


      describe('and the chain contains a block with an invalid field', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'i am bad data!';
          expect(Blockchain.isValidChain(blockchain)).toBe(false);
        });
      });

      describe('and the chain contains a block with a jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];

          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          //funny business here:
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const badBlock = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });

          blockchain.chain.push(badBlock);
          //false bc we are messing w/the chain
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe('and the chain does not contain any invalid blocks', () => {
        it('returns true', () => {

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    let logMock, errorMock;

    beforeEach(() => {
      logMock = jest.fn();
      errorMock = jest.fn();

      global.console.log = logMock;
      global.console.error = errorMock;
    });

    describe('when the new chain is not longer', () => {
      beforeEach(() => {
        newChain.chain[0] = { new: 'chain' };

        blockchain.replaceChain(newChain.chain);
      });

      it('does not replace the chain', () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it('logs an error', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });
//IT'S NOT THESE
    describe('when the new chain IS LONGER', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'Bears' });
        newChain.addBlock({ data: 'Beets' });
        newChain.addBlock({ data: 'Battlestar Galactica' });
      });

      describe('and the chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'some-fake-hash';

          blockchain.replaceChain(newChain.chain);
        });

        it('does not replace the chain', () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it('logs an error', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and the chain is valid', () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });

        it('replaces the chain', () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it('logs about the chain replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });


});





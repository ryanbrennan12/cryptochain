const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
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


  describe('isValidChain(', () => {
    describe('when the block does not start with the genisis block', () => {
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

      describe('and the chain does not contain any invalid blocks', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain)).toBe(true);
        });
      });
    });
  });
});






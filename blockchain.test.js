const BlockChain = require('./clockchain');
const Block = require('./block');

describe('Blockchain', () => {
  const blockchain = new Blockchain();

  it('contains a `chain` Array instance', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('starts with the genisis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genisis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'rye bread';
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
});
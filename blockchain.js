const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const lastBlock = this.chain[this.chain.length - 1];
    const newBlock = Block.mineBlock({ lastBlock, data });

    this.chain.push(newBlock);
  }

  isValidChain() {
    for (let i = 2; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      const prevPrev = this.chain[i - 2];

      if (currentBlock.lastHash !== cryptoHash(previousBlock.timestamp, prevPrev.hash, previousBlock.data)) {
        return false;
      }
    }
    if (this.chain[0] !== Block.genesis()) {
      return false;
    }
    return true;
  }
};


module.exports = Blockchain;


//.toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
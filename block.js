const  { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');


class Block {
  //the block class will receive values within individual instances of the Block
  //map as a function argument
  constructor({ timestamp, lastHash, data, hash }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    return new this({
      timestamp,
      lastHash,
      data,
      hash:  cryptoHash(timestamp, lastHash, data)
    });
  }
};

module.exports = Block;




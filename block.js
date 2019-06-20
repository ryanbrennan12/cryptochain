const  { GENESIS_DATA } = require('./config');


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
    console.log("HEYYYYY =>>>", lastBlock.hash)
    return new this({
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
      data
    });
  }
};

module.exports = Block;




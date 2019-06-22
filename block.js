const  { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');


class Block {
  //the block class will receive values within individual instances of the Block
  //map as a function argument
  constructor({ timestamp, lastHash, data, hash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    let hash = 'k', timestamp;
    // const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const { difficulty } = lastBlock;
    let nonce = 0;

    while(hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce ++;
      timestamp = Date.now();
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    }

    return new this({
      timestamp,
      lastHash,
      data,
      difficulty,
      nonce,
      hash:  cryptoHash(timestamp, lastHash, data, nonce, difficulty)
    });
  }
};

module.exports = Block;




const  { GENESIS_DATA, MINE_RATE } = require('/Users/ryanbrennan/Desktop/repls/cryptochain/config.js');
const cryptoHash = require('../util/crypto-hash');
const hexToBinary = require('hex-to-binary');

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

    const lastHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    while (hexToBinary(hash).substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce ++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
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

  static adjustDifficulty({ originalBlock, timestamp }) {
    //get difficulty from our last block to determine the next
    const { difficulty } = originalBlock;

    if (difficulty < 1) return 1;

    if (timestamp - originalBlock.timestamp > MINE_RATE) {
      return difficulty - 1;
    }
    return difficulty + 1;
  }
};



module.exports = Block;




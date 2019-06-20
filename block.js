const  { GENESIS_DATA } = require('./config');
// console.log(GENESIS_DATA)

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
    //we can refer to it inside bc of the static keyword
    return new Block(GENESIS_DATA);
  }


};



module.exports = Block;
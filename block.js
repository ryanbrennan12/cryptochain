
class Block {
  //the block class will receive values within individual instances of the Block
  //map as a function argument
  constructor({ timestamp, lastHash, data, hash }) {
      this.timestamp = timestamp;
      this.lastHash = lastHash;
      this.data = data;
      this.hash = hash;
  }

}

module.exports = Block;
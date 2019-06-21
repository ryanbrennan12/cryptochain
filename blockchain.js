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

  // static isValidChain(chain) {
  //   if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
  //     return false;
  //   };
  //   for (let i = 1; i < this.chain.length; i ++) {
  //     const { timestamp, lastHash, hash, data } = chain[i];
  //     const block = chain[i];
  //     const actualLastHash = chain[i - 1].hash;


  //     if (lastHash !== actualLastHash) return false;

  //     const validatedHash = cryptoHash(timestamp, lastHash, data);

  //     if (hash !== validatedHash) return false;
  //   }
  //   return true;
  // }
  static isValidChain(chain) {
    console.log('I am a chain ==>', chain[0])
    console.log('I am Genesis ==>', Block.genesis())
    console.log(JSON.stringify(chain[0]) === JSON.stringify(Block.genesis()))
    // if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
    //   return false
    // };
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i=1; i<chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      const actualLastHash = chain[i-1].hash;
      const lastDifficulty = chain[i-1].difficulty;

      // if (lastHash !== actualLastHash) return false;

      const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      // if (hash !== validatedHash) return false;


    }

    return true;
  }

}


module.exports = Blockchain;

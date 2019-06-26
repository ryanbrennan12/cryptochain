const { STARTING_BALANCE } = require('../config');
const { ec, verifySignature } = require('../util');
const cryptoHash = require('../util/crypto-hash');
const Transaction = require('./transaction');


class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('');
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount }) {
    if (amount > this.balance) {
      throw new Error('AMOUNT EXCEEDS BALANCE!!');
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }
}

module.exports = Wallet;






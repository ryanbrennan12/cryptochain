const uuid = require('uuid/v1');

//transactions have id's and informational output map
class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount })
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap  = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }
}

module.exports = Transaction;
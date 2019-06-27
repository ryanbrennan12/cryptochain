// import { log } from "util";

const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
//transactions have id's and informational output map
class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });

  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap  = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {

    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  static validTransaction(transaction) {
    const { input, outputMap } = transaction;
    const { address, amount, signature } = input;

    //input = 1000, our starting balance
    //
    //const { input: { address, amount, signature}, outputMap } = transaction;
    // console.log('i am the input', input)
    const outputTotal = Object.values(outputMap)
    .reduce((total, outputAmount) => {
      return total + outputAmount;
    })

    if (amount !== outputTotal) {
      console.error(`INVALID TRANSACTION FROM ${address}`)
      return false;
    }
    let verObj = {
      publicKey: address,
      data: outputMap,
      signature
    }
    if (!verifySignature(verObj)) {
      console.error(`INVALID SIGNATURE, ${signature}`)
      return false;
    }

    return true;
  }

  update({ senderWallet, recipient, amount }) {
    if(amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('AMOUNT EXCEEDS BALANCE!!')
    }

    if(!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    this.outputMap[senderWallet.publicKey] =
    this.outputMap[senderWallet.publicKey] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });

  }
}

module.exports = Transaction;
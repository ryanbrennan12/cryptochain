const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');


describe('TransactionPool', () => {
  let transactionPool;
  let transaction;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: new Wallet(),
      recipient: 'Ryan!',
      amount: 50
    })
  });

  describe('setTransaction()', () => {
    //this function will have two primary behaviors;
    it('adds a transaction', () => {
      //we will use transaction pool instance and call setTransaction
      //we are passing it a transaction object
      transactionPool.setTransaction(transaction);

      expect(transactionPool.transactionMap[transaction.id])
      //tobe checks for original instance of that object
        .toBe(transaction);
    });
  });
});

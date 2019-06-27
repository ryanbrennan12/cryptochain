
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const Blockchain = require('../blockchain/blockchain');
const PubSub = require('../app/pubsub');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });
const transactionPool = new TransactionPool();
const wallet = new Wallet();

const app = express();
app.use(bodyParser.json());

router.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

router.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

router.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

router.post('/api/transaction', (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });

    }
  } catch(error) {
    //will make sure we don't run the next

    return res.json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);
  res.json({ type: 'success', transaction });
});


module.exports = router;




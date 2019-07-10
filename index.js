const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const api = require('./routes/api');

const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub');
const Wallet = require('./wallet');
const TransactionPool = require('./wallet/transaction-pool');
const TransactionMiner = require('./app/transaction-miner');

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({ blockchain, transactionPool });
const wallet = new Wallet();
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const app = express();


const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));



// @route  GET /api/blocks
// @desc   Allows requester to get all blocks in the blockchain instance
// @access Public
app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

// @route  POST /api/mine
// @desc   Allows requester to get data in transaction pool map
// @access Public
app.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});

// @route  POST /api/transaction
// @desc   Allows requester to generate a transaction
// @access Public
app.post('/api/transaction', (req, res) => {
  const { amount, recipient } = req.body;
  let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
    }
  } catch(error) {
    //will make sure we don't run the next
    return res.json({ type: 'error', message: error.message });
  }
  transactionPool.setTransaction(transaction);

  pubsub.broadcastTransaction(transaction);
  res.json({ type: 'success', transaction });
});


// @route  GET /api/transaction-pool-map
// @desc   Allows requester to get data in transaction pool map
// @access Public
app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});


// @route  GET /api/mine-transactions
// @desc   Allows requester to call mineTransactions method in order...
// contd: to add a block of transactions to the blockchain
// @access Public
app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect('/api/blocks');
});

// @route  GET api/wallet-info'
// @desc   Allows requester to retrieve adress and balance
// @access Public
app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address: address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address: address })
   });
});



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});



const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });
};

const walletFoo = new Wallet();
const walletBar = new Wallet();

const generateWalletTransaction = ({ wallet, recipient, amount }) => {
  const transaction = wallet.createTransaction({
    recipient, amount, chain: blockchain.chain
  });

  transactionPool.setTransaction(transaction);
};

const walletAction = () => generateWalletTransaction({
  wallet, recipient: walletFoo.publicKey, amount: 5
});

const walletFooAction = () => generateWalletTransaction({
  wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
});

const walletBarAction = () => generateWalletTransaction({
  wallet: walletBar, recipient: wallet.publicKey, amount: 15
});

for (let i = 0; i < 10; i++) {
  if (i % 3 === 0) {
    walletAction();
    walletFooAction();
  } else if (i % 3 === 1) {
    walletAction();
    walletBarAction();
  } else {
    walletFooAction();
    walletBarAction();
  }

  transactionMiner.mineTransactions();
}


let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});

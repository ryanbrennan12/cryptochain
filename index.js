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
const devSeed = require('./seed.js').devSeed;

const isDevelopment = process.env.ENV === 'development';
//6379 is port of LOCAL redis server
const REDIS_URL = isDevelopment ?
  'redis://127.0.0.1:6379' :
  'redis://h:p95ad178a7e121bbfa0edcec0bb3a9705a4ebf65fd52ac1af7e903579723d8477@ec2-3-218-42-198.compute-1.amazonaws.com:16909'
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`


const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });
const wallet = new Wallet();
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

//set up routes
app.use('/', api);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));


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

if (isDevelopment) {
  devSeed();
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
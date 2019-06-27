const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const api = require('./routes/api');

const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const app = express();
//our instantions
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`

app.use(bodyParser.json());
app.use(express.static('client/dist'));
app.use('/', api);

// app.get('/api/blocks', (req, res) => {
//   res.json(blockchain.chain);
// });

// app.get('/api/wallet-info', (req, res) => {

//   res.json('Im coming in hot from the server!!!!')
// });

// app.post('/api/mine', (req, res) => {
//   const { data } = req.body;

//   blockchain.addBlock({ data });
//   pubsub.broadcastChain();
//   res.redirect('/api/blocks');
// });
//need this??
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'))
});

const syncChains = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`We listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});







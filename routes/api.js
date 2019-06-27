
const express = require('express');
const router = express.Router();

const Blockchain = require('../blockchain/blockchain');
const PubSub = require('../app/pubsub');

const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

router.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

router.get('/api/wallet-info', (req, res) => {

  res.json('Im coming in hot from the server!!!!')
});

router.post('/api/mine', (req, res) => {
  const { data } = req.body;

  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect('/api/blocks');
});


module.exports = router;
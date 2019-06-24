const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');


const app = express();
const blockchain = new Blockchain();
const port = 3000;

app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  console.log(req.body)
  const { data } = req.body;

  blockchain.addBlock({ data });
  res.redirect('/api/blocks');
});

app.listen(port, () => {
  console.log(`We listening at localhost:${port}`);
})


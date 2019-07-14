# 1. StellumCoin TOC
  - [1 StellumCoin TOC](#1-stellumcoin-toc)
  - [1.2 UI](#12-UI)
  - [1.2.2. Nodes in Network](#122-nodes-in-network)
  - [1.2.3. Development Setup](#123-development-setup)
  - [1.3. Usage](#13-usage)
    - [1.3.2. Walkthrough and Proof of Work System](#132-walkthrough-and-proof-of-work-system)
    - [1.3.3. Fifty One Percent Attack](#133-fifty-one-percent-attack)
    <!-- - [1.3.3. Individual Component Page](#133-individual-component-page) -->
 - [1.4. API](#14-api)
 - [1.4.2. API endpoints](#142-api-endpoints)
 - [1.5 Walkthrough Continued](#15-walkthrough-continued)
 - [1.5.2 Cryptocurrency](#152-cryptocurrency)

## 1.2 UI
Example of a transaction that is sent to a wallet.  That transaction is then mined into a block (most blocks have multiple transactions but we are doing only one for the sake of the example) and are added to the blockchain.  Details of the transactions within each block are ableto be viewed  by the user when clicked through.

![upload](UI.gif)

## 1.2.2. Nodes in Network

The following are the deployed nodes existing in the network which are all able to interact with one another and maintain the same blockchain.

 - Node 1: [www.stellumcoinone.com](https://quiet-wave-32128.herokuapp.com)
 - Node 2: [www.stellumcointwo.com](https://vast-oasis-19068.herokuapp.com)
 - Node 3: [www.stellumcointhree.com](https://guarded-citadel-78699.herokuapp.com)
 - Node 4: [www.stellumcoinfour.com](https://obscure-ridge-16236.herokuapp.com)
 - Node 5: [www.stellumcoinfive.com](https://vast-garden-13834.herokuapp.com)
 - Node 6: [www.stellumcoinsix.com](https://limitless-wildwood-80470.herokuapp.com)

## 1.3. Usage

StellumCoin is a custom Blockchain-powered cryptocurrency. Wallet and persisted transaction data stored on a ledger through a network of multiple deployed Heroku nodes on Node JS backends.  There is a proof-of-work system to demand computational power by needing to use cryptography and data hashing to protect the system against abuse. There is also a validation system for the transactional data of the blockchain itself.

### 1.3.2. Walkthrough and Proof of Work System

  Starting in `Block.js`- `difficulty` and `nonce` are implemented for a proof-of-work system to account for how quickly new blocks can be created and added to the blockchain.

  - `Genesis Block` - Initial Dummy Block with hard-coded values to get the blockchain going
  -  First blocks are added in the `mineBlock` function.
  - `Do while loop` - important for the overall proof-of-work system
  -  To create a block, we have a cryptographic security in place with the HASH method
  -  That HASH method is implemented through a `cryptohash.js` implementation
  - This `hash method` will take in any number of inputs and it will:
     1) sort them
     2) it will stringify those inputs to track any changes to objects
     3) and it creates a unique hash based off of that.
     4) This allows us to link blocks together in a Blockchain Class.

 Now in `Blockchain.js`

  - This blockchain collects multiple blocks together in a `chain array`
  - Every block’s lastHash field must be set to the hash of the previous block
  - Which is why when a block is added, the last block reference is passed, thus creating links between each block
  - `isValidChain` method:
  - Blockchain’s power comes from blocks being able to interact with each other and a huge part of that is validating blockchains contributed by other users/nodes
  - method has TWO checks:
    1) Last hash of each block must be valid
    2) `difficulty requirement` for each validated hash:
      - This is based off a leading zero bits implementation for the cryptohash
      - `generated hash field` based off of all the block fields itself must be correct according to a validated hash
 - All these checks together make sure a valid blockchain looks good and no one can break the hash linking
 - None can tamper with following w/o breaking this generated hash validation:
    1) The `data`
    2) The `timestamp`
    3) The `hash`
- `replaceChain` method:
- If an incoming chain is longer than the current blockchain array and it’s valid, it is time to replace the chain
- So overall system works  on multiple nodes agreeing on the longest version of the valid blockchain!!! The longer it gets, the more powerful and difficult to beat it becomes. More POWER!

Back in `Block.js`
 - `mineBlock` method is an analogy for doing that proof-of-work and spending the CPU power to find a valid hash to add a new block. Thus the valid hash must meet a difficulty requirement!!
 - this requirement is there a certain number of leading zero bits when it comes to the actual hash value
 - `adjustDifficulty` method: overall achieved by averaging the rate at which the blocks get mined in the system to come close to a set `MINE_RATE`
 - this way by raising the difficulty, the network can slow the miners down or lower it so the miners can find hashes more quickly.

### 1.3.3. Fifty One Percent Attack
  - Overall this proof-of work system helps prevent a 51% attack
  - This is a scenario where one blockchain node in the overall network has a majority of the computational power
  - In theory they could build a chain in their favor, but valid.
  - And because it is valid AND longer, every node in the network would have to accept the chain
  - However POW system makes it insanely computationally expensive to attempt such an attack

## 1.4. API

Starting in `pubsub.js`
 - Pubsub class follows PUBLISHER-SUBSCRIBER paradigm for passing messages between servers
 - Rather than an implementation that would have to keep track of the addresses of every blockchain peer in order to communicate, pubsub implementation has a lot less overhead
 - Works by having `CHANNELS` where `SUBSCRIBERS` listen for messages and `PUBLISHERS` can `BROADCAST` their messages
    1) Blockchain Channel
    2) Transaction Channel

### 1.4.2. API endpoints

Below you can find all available endpoints.

  - GET `/api/blocks`
    - retrieves all paths in database (shouldn't really be used except for testing)
  - POST `/api/mine`
    - Allows requester to mine a block and add it to the chain
  - POST `/api/transaction`
    - Allows requester to generate a transaction
  - GET `/api/transaction-pool-map`
    - Allows requester to get data in transaction pool map (transactions yet to be mined)
  - GET `/api/mine-transactions`
    - Allows requester to call `mineTransactions` method in order to add a block of transactions to the blockchain
  - GET `/api/wallet-info`
    - Allows requester to retrieve address and balance
  - GET `/api/known-addresses`
    - When users goes to conduct a transaction, this route is called to display known wallet addresses on that page

## 1.5. Walkthrough Continued
### 1.5.2. Cryptocurrency

Now in `wallet/index.js` with the Wallet Class
 - Digital wallet is a way to allow multiple users to interact with eachother in the cryptocurrency
 - Primary function:
    1) Hold all-important key-pair which contains a `public` and a `private` key
    2) `Public` is an address to receive currency on the system and `private` must be kept secret
 - By using private key in the key pair, wallet has capability of creating unique signatures for data

In `transaction.js`
  - Transaction objects are official records of the exchange of currency between two wallets
  - `input`: Contains official signature form actual sender wallet
  - `outputmap`: Contains any values that were conducted in the transaction
    1) Recipient
    2) Then any other values for recipient in the update function
    3) Remaining balance for the sender wallet

As multiple users start contributing these transactions we collect that data in the TransactionPool structure

In `transaction-pool.js`
  - `TransactionPool` structure has a Inner Transaction map that can set transactions and update existing ones in the same code path or even replace the entire transaction map if it needs to.
  - `TransactionMiner` object
    1) Gets valid transactions from the pool
    2) Has reward transaction for getting currency for getting valid hash that consists of the valid transactions
    3) Then adds it to the blockchain and broadcasts the chain
    4) Clears local transaction pool

With transactions recorded in the blockchain, it allows wallet to keep track of an accurate balance

Back to `wallet/index.js` and the `calculateBalance` method:
   - Idea is that balance at any point in time is the output amount for that wallet at its most recent transaction
   - This is in addition to any output amounts that it received in the blockchain history after that most recent transaction

Lastly to ` blockchain.js`
 - `validTransactioData` method enforces forming rules for the cryptocurrency:
    1) There should not be duplicate miner rewards in the block
    2) Transaction should have a valid shape overall
    3) Meaning its input signature should be good and output map should be formatted correctly
      1) Outputotal that matches the input amount
      2) Miner rewards should have the correct mining reward value as well
      3) Input balances must be valid and correct according to the blockchain history
      4) Should be no duplicates of a transaction within a block




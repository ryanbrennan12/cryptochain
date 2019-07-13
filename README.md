# 1. StellumCoin TOC

  - [1.3. Usage](#13-usage)
    - [1.3.2. Walkthrough](#132-walkthrough)
    - [1.3.3. Individual Component Page](#133-individual-component-page)
  - [1.4. Development Setup](#14-development-setup)

## 1.3. Usage

StellumCoin is a custom Blockchain-powered cryptocurrency. Wallet and persisted transaction data stored on a ledger through a network of multiple deployed Heroku nodes on Node JS backends.  There is a proof-of-work system to demand computational power by needing to use cryptography and data hashing to protect the system against abuse. There is also validation system for the transactional data of the blockchain itself.

### 1.3.1. Walkthrough and Proof-of-Work Syetem

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










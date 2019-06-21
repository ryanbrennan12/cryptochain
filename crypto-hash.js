const SHA256 = require('crypto-js/sha256');

const cryptoHash = (str) => {
  return SHA256(str)
}
//exporting function as default export
module.exports = cryptoHash
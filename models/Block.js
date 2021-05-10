const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(lastBlockHash = null, timestamp = Date.now(), nonce = 0, transactions = []) {
    this.lastBlockHash = lastBlockHash;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.transactions = transactions;
  }
  addTransaction(tx) {
    this.transactions.push(tx);
  }
  hash() {
    return SHA256(
        this.timestamp + "" +
        this.nonce + "" +
        this.lastBlockHash +
        JSON.stringify(this.transactions)
    ).toString();
  }
  execute() {
    this.transactions.forEach(x => x.execute());
  }
}

module.exports = Block;

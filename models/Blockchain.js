const Block = require("./Block");
const SHA256 = require('crypto-js/sha256');

class Blockchain {

  constructor() {
    this.blocks = [];
    this.blockDurations = [];
    this.minDifficultyLeadingZeroes = 4;
    this.maxDifficultyLeadingZeroes = 8;
    this.difficultyLeadingZeroes = this.minDifficultyLeadingZeroes;
    this.setTargetDifficulty();
    this.targetBlockTimeSeconds = 15;
    this.blockReward = 10;
    this.utxos = [];
    this.lastBlockTime = Date.now();
  }
  addBlock(blockData, publicAddress) {
    const block = new Block(blockData.lastBlockHash, blockData.timestamp, blockData.nonce, blockData.transactions);
    const validLastBlockHash = this.getLastBlock() ? this.getLastBlock().hash() : null;
    if (validLastBlockHash === block.lastBlockHash) {
      const newBlockTime = Date.now();
      this.blockDurations.push(newBlockTime - this.lastBlockTime);
      this.lastBlockTime = newBlockTime;
      this.blocks.push(block);
      this.recalculateDifficulty();
      console.log(`Mined block #${this.blockHeight()} with hash: (${block.hash().substr(0, 10)}...) by miner: ${publicAddress} at nonce ${block.nonce}`);
    }
  }
  recalculateDifficulty() {
   if (this.blockDurations.length % 2 === 0) {
     // last 25 blockTimes
     const recentBlockTimes = this.blockDurations.slice(-25);
     const recentBlockTimeAvg = recentBlockTimes.reduce((a, b) => a + b, 0) / recentBlockTimes.length;
     const totalBlockTimeAvg = this.blockDurations.reduce((a, b) => a + b, 0) / this.blockDurations.length;
     console.log(`Recalculating Difficulty -- Average Block Time: Last 25: ${Math.floor(recentBlockTimeAvg / 1000)}sec Total: ${Math.floor(totalBlockTimeAvg / 1000)}sec`);
      if (Math.floor(recentBlockTimeAvg / 1000) < (this.targetBlockTimeSeconds - 5)) {
        // Difficulty up
        this.increaseTargetDifficulty();
      } else if (Math.floor(recentBlockTimeAvg / 1000) > (this.targetBlockTimeSeconds + 5)) {
        // Difficulty down
        this.decreaseTargetDifficulty();
      }
   }
  }
  increaseTargetDifficulty() {
    if (this.difficultyLeadingZeroes < this.maxDifficultyLeadingZeroes) {
      this.difficultyLeadingZeroes++;
      this.setTargetDifficulty();
      console.log(`Difficulty increased to ${this.difficultyLeadingZeroes} leading zeros.`);
    }
  }
  decreaseTargetDifficulty() {
    if (this.difficultyLeadingZeroes > this.minDifficultyLeadingZeroes) {
      this.difficultyLeadingZeroes--;
      this.setTargetDifficulty();
      console.log(`Difficulty decreased to ${this.difficultyLeadingZeroes} leading zeros.`);
    }
  }
  setTargetDifficulty() {
    this.targetDifficulty = BigInt("0x0" + "F".repeat((64 - this.difficultyLeadingZeroes)));
  }
  getTargetDifficulty() {
    return this.targetDifficulty;
  }
  blockHeight() {
    return this.blocks.length;
  }
  getLastBlock() {
    return this.blocks[this.blockHeight() - 1];
  }
}

module.exports = Blockchain;

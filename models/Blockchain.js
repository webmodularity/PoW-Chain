const Block = require("./Block");
const SHA256 = require('crypto-js/sha256');

class Blockchain {
  static minDifficultyLeadingZeroes = 4;
  static maxDifficultyLeadingZeroes = 8;
  static targetBlockTimeSeconds = 15;
  static targetBlockVarianceSeconds = 5;
  static recalculateEveryBlock = 2;
  static recalculateLastBlocks = 25;
  static blockReward = 10;

  constructor() {
    this.blocks = [];
    this.blockDurations = [];
    this.utxos = [];
    this.difficultyLeadingZeroes = Blockchain.minDifficultyLeadingZeroes;
    this.setTargetDifficulty();
    // Genesis Block
    const genesisBlock = new Block('0x' + "0".repeat(64));
    this.blocks.push(genesisBlock);
    this.lastBlockTime = Date.now();
  }
  addBlock(flattenedBlock, publicAddress) {
    const block = new Block(flattenedBlock.lastBlockHash, flattenedBlock.timestamp, flattenedBlock.nonce, flattenedBlock.transactions);
    if (this.getLastBlock().hash() === block.lastBlockHash) {
      const newBlockTime = Date.now();
      this.blockDurations.push(newBlockTime - this.lastBlockTime);
      this.lastBlockTime = newBlockTime;
      this.blocks.push(block);
      this.recalculateDifficulty();
      console.log(`Mined block #${this.blockHeight()} with hash: (${block.hash().substr(0, 10)}...) by miner: ...${publicAddress.slice(-10)} at nonce ${block.nonce}`);
      return block.hash();
    } else {
      // Stale Block
      return false;
    }
  }
  recalculateDifficulty() {
   if (this.blockDurations.length % Blockchain.recalculateEveryBlock === 0) {
     const recentBlockTimes = this.blockDurations.slice(-(Blockchain.recalculateLastBlocks));
     const recentBlockTimeAvg = recentBlockTimes.reduce((a, b) => a + b, 0) / recentBlockTimes.length;
     const totalBlockTimeAvg = this.blockDurations.reduce((a, b) => a + b, 0) / this.blockDurations.length;
     console.log(`Recalculating Difficulty -- Average Block Time: Last ${Blockchain.recalculateLastBlocks}: ${Math.floor(recentBlockTimeAvg / 1000)}sec Total: ${Math.floor(totalBlockTimeAvg / 1000)}sec`);
      if (Math.floor(recentBlockTimeAvg / 1000) < (Blockchain.targetBlockTimeSeconds - Blockchain.targetBlockVarianceSeconds)) {
        // Difficulty up
        if (this.difficultyLeadingZeroes < Blockchain.maxDifficultyLeadingZeroes) {
          this.difficultyLeadingZeroes++;
          this.setTargetDifficulty();
          console.log(`Difficulty increased to ${this.difficultyLeadingZeroes} leading zeros.`);
        }
      } else if (Math.floor(recentBlockTimeAvg / 1000) > (Blockchain.targetBlockTimeSeconds + Blockchain.targetBlockVarianceSeconds)) {
        // Difficulty down
        if (this.difficultyLeadingZeroes > Blockchain.minDifficultyLeadingZeroes) {
          this.difficultyLeadingZeroes--;
          this.setTargetDifficulty();
          console.log(`Difficulty decreased to ${this.difficultyLeadingZeroes} leading zeros.`);
        }
      } else {
        console.log(`Difficulty unchanged at ${this.difficultyLeadingZeroes} leading zeros.`);
      }
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

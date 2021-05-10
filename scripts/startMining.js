const client = require('./client');
const {argv} = require('yargs');
const {address} = argv;
const Block = require("../models/Block");

mine();

async function mine() {
  while (true) {
    const miningResponse = await client.request('startMining', []);
    const newBlock = await mineBlock(miningResponse.lastBlockHash, miningResponse.targetDifficulty);
    const submittedBlock = await client.request('submitNewBlock', [newBlock, address]);
    if (submittedBlock.lastBlockHash) {
      console.log(`New Block Added! Hash: (${submittedBlock.lastBlockHash})`);
    } else {
      console.log(`New Block Add FAILED! Stale Block not added to chain!`);
    }
  }
}

async function mineBlock(lastBlockHash, targetDifficultyHex) {
  const block = new Block(lastBlockHash);

  // TODO: add transactions from the mempool

  //const coinbaseUTXO = new UTXO(this.publicAddress, this.blockchain.blockReward);
  //const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  //block.addTransaction(coinbaseTX);
  while(BigInt('0x' + block.hash()) >= BigInt('0x' + targetDifficultyHex)) {
    block.nonce++;
    if (block.nonce >= 2147483647) {
      block.timestamp++;
      block.nonce = 0;
    }
  }
  block.execute();
  return block;
}
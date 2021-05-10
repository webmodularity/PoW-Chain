const client = require('./client');
const {argv} = require('yargs');
const {address} = argv;

const Miner = require("../models/Miner");
const Block = require("../models/Block");
const miner = new Miner(address);

mine();

async function mine() {
  while (true) {
    const miningResponse = await client.request('startMining', []);
    const lastBlockHash = miningResponse.block ? miningResponse.block.lastBlockHash : null;
    const newBlock = miner.mineBlock(lastBlockHash, miningResponse.targetDifficulty);
    const submittedBlock = await client.request('submitNewBlock', [newBlock, address]);
    if (submittedBlock.lastBlock) {
      const lastBlock = new Block(submittedBlock.lastBlock.lastBlockHash, submittedBlock.lastBlock.timestamp, submittedBlock.lastBlock.nonce, submittedBlock.lastBlock.transactions);
      console.log(lastBlock);
      console.log(`New Block Added! ${newBlock.hash()}`);
    } else {
      console.log(`New Block Failed! ${submittedBlock.lastBlock}`)
    }

  }
}
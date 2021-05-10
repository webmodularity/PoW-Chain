const Block = require('./Block');
const Transaction = require('./Transaction');
const UTXO = require('./UTXO');

class Miner {
    constructor(publicAddress) {
        this.publicAddress = publicAddress;
    }
    mineBlock(lastBlockHash, targetDifficultyHex) {
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
        console.log(`Mined Block -- Last Block Has: ${lastBlockHash}`);
        return block;
    }
}

module.exports = Miner;

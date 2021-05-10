const {PORT} = require('./config');
const Blockchain = require('./models/Blockchain');
const blockchain = new Blockchain();
const express = require('express');
const app = express();
const cors = require('cors');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.post('/', (req, res) => {
    const {method, params} = req.body;
    if(method === 'startMining') {
        res.send({
            lastBlockHash: blockchain.getLastBlock().hash(),
            targetDifficulty: blockchain.getTargetDifficulty().toString(16)
        });
        return;
    }
    if(method === 'submitNewBlock') {
        const [block, address] = params;
        const lastBlockHash = blockchain.addBlock(block, address);
        res.send({lastBlockHash: lastBlockHash});
        return;
    }
    if(method === "getBalance") {
     // const [address] = params;
     // const ourUTXOs = utxos.filter(x => {
     //   return x.owner === address && !x.spent;
     // });
     // const sum = ourUTXOs.reduce((p,c) => p + c.amount, 0);
     // res.send({ balance: sum.toString()});
  }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});

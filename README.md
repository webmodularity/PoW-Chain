# Proof of Work Chain

This is an example Proof of Work Chain with a server/miner cli interface.

## Server

First you'll want to start the server. You'll want to install all the dependencies with `npm i` from the root directory in the terminal.

Once you've installed the dependencies you can run the server with `node index` or `nodemon index` (the latter of which will restart the server if you make any changes!). This currently starts your server at port `3032` by default.

## Miner

Generate an address (or multiple) to assign to miner using `node scripts/generate`.

To run a miner instance use:
`node scripts/startMining --address=YOUR_PUBLIC_ADDRESS`

## Features

- Server accepts connections from multiple miners using simple requests to communicate between miner/server.
- Difficulty is adjusted by increasing/decreasing required amount of leading zeros in hash based on a target block time. Difficulty settings including desired block time, etc. are configurable with the static properties of the `Blockchain` class.
- Miner can be run at different location than server as long as network path available.
- Tracks hash of previous block and will not add a new block without validating previousHash.

## TODO

- Need a way to interrupt miner that is currently mining if block already found. Current behavior is to keep mining until a solution is found and submit block to server (even if it is stale). Server should send miner a signal to trigger mining from current block.
- Add transactions/UTXOs and implement script to getBalance for specified address.
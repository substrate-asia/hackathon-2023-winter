## Role scan

This package scans history blocks, check councilor and validator info and save ex-councilor and previous and current
validators to database.

### How to run

1. Set `.env`. We can simply run `cat .env.example > .env`, or edit `.env` by your local environment.
2. Run `node src/index.js`.

### Env variables

```
WS_ENDPOINT=wss://rpc.polkadot.io # chain RPC endpoint, used for blockchain data query
CHAIN=polkadot # which chain we are going to scan 

MONGO_ROLE_SCAN_URL=mongodb://127.0.0.1:27017 # mongodb url
MONGO_ROLE_SCAN_NAME=qf-polkadot-councilor # mongodb database name

SCAN_STEP=100 # How many blocks we will query and handle in a batch 

USE_META=1 # whether to use pre saved block meta info, set 0 if not use
MONGO_META_URL=mongodb://127.0.0.1:27017
MONGO_DB_META_NAME=meta-polkadot

LOG_LEVEL=info
NODE_ENV=production
```

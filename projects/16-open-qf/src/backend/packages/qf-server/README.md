## QF server

This package will run a restful server for quadratic funding related business data. Some other components include:

- Several polkadot API instances will be maintained for querying on-chain info like fellowship members and identity
  info.
- Scripts to populate mock data, calculate matching power for contributors, and calculate the final matched fund for
  projects.
- Support github account link to polkadot address.

### How to run

1. Set `.env`. We can simply run `cat .env.example > .env`, or edit `.env` by your local environment.
2. Run `node src/index.js`.

### env variables

```
PORT=5010 # restful server port

# Server database settings
MONGO_QF_SERVER_URL=mongodb://127.0.0.1:27017
MONGO_QF_SERVER_NAME=qf-polkadot

# Account chain data scan database info
MONGO_ACCOUNT_SCAN_URL=mongodb://127.0.0.1:27017
MONGO_ACCOUNT_SCAN_NAME=qf-polkadot-account

# Treasury chain data scan database info
MONGO_TREASURY_SCAN_URL=mongodb://127.0.0.1:27017
MONGO_TREASURY_SCAN_NAME=qf-polkadot-treasury

# Councilor/fellowship members data scan database info
MONGO_ROLE_SCAN_URL=mongodb://127.0.0.1:27017
MONGO_ROLE_SCAN_NAME=qf-polkadot-councilor

# Governance related date scan database info
MONGO_GOV_SCAN_URL=mongodb://127.0.0.1:27017
MONGO_GOV_SCAN_NAME=qf-polkadot-governance

# collectives para-chain
COL_ENDPOINTS=wss://sys.ibp.network/collectives-polkadot;wss://sys.dotters.network/collectives-polkadot;wss://rpc-collectives-polkadot.luckyfriday.io
DOT_ENDPOINTS=wss://rpc.ibp.network/polkadot;wss://rpc-polkadot.luckyfriday.io

NODE_ENV=production
```

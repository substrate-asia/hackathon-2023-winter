# Indexer

A simple contract event indexer for testing propose.

It will pull all target contract events and process them before feeding them into the target database. It is designed for re-running purposes, so it is safe to maintain a re-run interval.

## Preparations

Require Bun 1.0.15.

Install dependencies:

```shell
bun install
```

Setup `DATABASE_URL` via `.env`, then run:

```shell
bun run index_answer_nft_events.ts
```

The database schema is maintained by Prisma migration in `webapp` folder.

Oneliner:

```shell
while true; do bun run index_answer_nft_events.ts; sleep 30; done
```

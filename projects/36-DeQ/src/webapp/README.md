# Webapp

Built with [next.js](https://nextjs.org/) 13 + [tRPC](https://trpc.io/) + [Prisma](https://www.prisma.io/).


## Preparations

Node 18+ & Postgres 14.

```bash
npm install
```

Copy `.env.example` to `.env` and configure it, and run migration:

```bash
npm run db:migrate && npm run db:seed
```

Then up and run the testing environment:

```
npm run dev
```

Visit http://localhost:3000

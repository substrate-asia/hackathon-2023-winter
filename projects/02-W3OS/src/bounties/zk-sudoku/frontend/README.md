# zkGames frontend

This folder contains the frontend of the zkGames application.

The frontend is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and deployed on [Vercel](https://github.com/vercel/vercel).

## Install dependencies

```bash
yarn install
```

## Env Config
Add chain info in `utils/networks.json`
For example, add Moonbase Alpha and set it as the default chain:
```json
{
    "selectedChain": "1287",
    "1287": {
        "chainId": "1337",
        "chainName": "Moonbase Alpha",
        "rpcUrls": ["https://moonbase-alpha.public.blastapi.io"],
        "nativeCurrency": {
            "symbol": "DEV"
        },
        "blockExplorerUrls": ["https://moonbase.moonscan.io/"]
    },
}
```

Modify contract addresses in `utils/contractaddress.json`


## Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

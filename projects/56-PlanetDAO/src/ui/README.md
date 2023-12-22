

## Getting Started

First, run :

```bash
npm i
# or
yarn
```


Then, run the development server:

```bash
npm run dev
# or
yarn dev
```



## Implementation

We are using hyperlane and wormhole. We deployed the PlanetDAO smart contract on the moonbase network. We are using wormhole to send transfers to moonbase network from other chains (such as Celo, BNB, Goerli). And for other integrations, such as creating daos, goals, ideas, messages etc. we are using hyperlane. So, user can create those from other chains (eg. Celo, BNB or Goerli). We are using hyperlane to message from multiple chains. Apart from this we have used builder. So, here the DAO manager can customise his DAO page. The customizations are saving into smart contract. Then we are retrieving saved html in DAO page. Also we have used Batch precompiles. Using it people can send multiple transactions at once.


### Builder Code

```bash
/pages/DesignDao/index.jsx
```


### Hyperlane Code

```bash
/services/userContract.js
```


### Wormhole Code

```bash
/services/wormhole/useSwap.js
```




## Contact info:
### telegram:
https://t.me/Bahauddin1976

### Skype:
live:5385a714ad774375
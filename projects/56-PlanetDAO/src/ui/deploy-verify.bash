npm run deploy
cd contracts 
npx hardhat verify --network moonbase $(cat address.txt)
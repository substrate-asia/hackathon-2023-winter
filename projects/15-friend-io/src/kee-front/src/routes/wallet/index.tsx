import { Contract, InterfaceAbi, Wallet, ethers } from "ethers";
import { memo, useEffect } from "react";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";
import { useLazyGetWalletByUidQuery } from "@/app/services/user";
import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";
import { KeyringPair } from "@polkadot/keyring/types";
import { GearKeyring } from "@gear-js/api";

const NETWORK = "arbitrum-sepolia";
//在infura中申请的key
const API_KEY = "53119e34e0294563ab8d294d8ea8adb9";
const JSON_RPC_URL = "https://arbitrum-sepolia.infura.io/v3/53119e34e0294563ab8d294d8ea8adb9";
const contractAddress = "0x6c50E3C83d7710DE9a993dac8bBC990e459e3865";

//创建一个新的钱包账户
export const createNewWallet = async () => {
  alert("create default wallet for user");
  await cryptoWaitReady();
  const provider = new WsProvider("wss://testnet.vara-network.io");

  const mnemonic = GearKeyring.generateMnemonic();
  const { seed } = GearKeyring.generateSeed(mnemonic);
  localStorage.setItem(KEY_WALLET_PRIVATE_KEY, mnemonic);
  const keyring: KeyringPair = await GearKeyring.fromSeed(seed, "name");

  localStorage.setItem(KEY_WALLET_ADDRESS, keyring.address);

  console.log("keyring.address:", keyring.address);
  console.log("seed:", mnemonic);

  let walletAddress = keyring.address;
  return walletAddress;
};

export const getGearWallet = async (): Promise<KeyringPair | null> => {
  const mnemonic = localStorage.getItem(KEY_WALLET_PRIVATE_KEY);
  let wallet = null;
  if (mnemonic) {
    const keyring = await GearKeyring.fromMnemonic(mnemonic, "name");
    console.log("keyring.address", keyring.address);
    wallet = keyring;
  }
  return wallet;
};

const getWallet = (): Wallet | null => {
  // const provider = new ethers.getDefaultProvider('https://goerli.infura.io/v3/9df29b35c83d4e4c87a8cde2034794f1');
  // const privateKey = fs.readFileSync(".secret").toString().trim();
  // const wallet = new ethers.Wallet(privateKey, provider);

  const privateKey = localStorage.getItem(KEY_WALLET_PRIVATE_KEY);
  let wallet = null;
  if (privateKey) {
    const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
    wallet = new Wallet(privateKey, provider);
  }
  return wallet;
};

export const getContract = (): Contract => {
  const wallet = getWallet();
  const abi = require("@/abis/abi.json");
  // 获取合约，参数：contractAddress、contractABI、signer
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  return contract;
};

function myWallet() {
  const [
    getWalletByUid,
    { isLoading: usersLoading, isSuccess: usersSuccess, isError: usersError, data: wallet }
  ] = useLazyGetWalletByUidQuery();

  const loginUser = useAppSelector((store) => store.authData.user, shallowEqual);

  // useEffect(() => {
  //   const loginUser = useAppSelector((store) => store.authData.user, shallowEqual);
  //   const uid = loginUser?.uid;
  //   if(uid){
  //     getWalletByUid(2);
  //   }
  // }, []);

  const connectJsonRpcUrl = async () => {
    const wallet = getWallet();
    const provider = new ethers.JsonRpcProvider(JSON_RPC_URL);
    if (wallet) {
      provider.getBalance(wallet).then((balance) => {
        alert(balance);
      });
    } else {
      alert("wallet not exist");
    }
  };

  // 获取合约
  const buyShare = async () => {
    const contract = getContract();
    // 检查用户钱包地址是否存在.
    const uid = loginUser?.uid;
    if (uid) {
      let shareWallet = await getWalletByUid(uid);
      console.log("shareWallet is" + JSON.stringify(shareWallet.data));
      // console.log("shareWallet is:" + shareWallet);
      if (shareWallet.data) {
        // 得到用户的购买价格
        let buyPriceAfterFee = await contract.getBuyPriceAfterFee(
          "0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E",
          1
        );
        // 去购买用户的share
        console.log("buyPriceAfterFee is:  " + buyPriceAfterFee);
        let shareSupply = await contract.sharesSupply("0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E");
        console.log("shareSupply is:%d", shareSupply);
        // const result = await contract.buyShares.staticCall(
        //   "0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E",
        //   1
        // );
        const result = await contract.buyShares("0xeA398f3037b3F7EE32BC7E1FABBF66cf22Bb537E", 1, {
          value: buyPriceAfterFee
        });
        console.log("result is:" + JSON.stringify(result));
      }
    }

    return contract;
  };

  //连接内置钱包账户
  const connectCustomWallet = (wallet: Wallet): Wallet => {
    const provider = new ethers.InfuraProvider(NETWORK, API_KEY);
    provider.getBalance(wallet);
    const connectWallet = wallet.connect(provider);
    return connectWallet;
  };

  return (
    <>
      <div onClick={buyShare}>my wallet</div>
    </>
  );
}

export default memo(myWallet);

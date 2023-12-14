import { Contract, InterfaceAbi, Wallet, ethers } from "ethers";
import { memo, useEffect } from "react";
import { KEY_WALLET_ADDRESS, KEY_WALLET_PRIVATE_KEY } from "@/app/config";
import { useLazyGetWalletByUidQuery } from "@/app/services/user";
import { useAppSelector } from "@/app/store";
import { shallowEqual } from "react-redux";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { cryptoWaitReady, mnemonicGenerate } from "@polkadot/util-crypto";

const NETWORK = "arbitrum-sepolia";
//在infura中申请的key
const API_KEY = "53119e34e0294563ab8d294d8ea8adb9";
const JSON_RPC_URL = "https://arbitrum-sepolia.infura.io/v3/53119e34e0294563ab8d294d8ea8adb9";
const contractAddress = "0x6c50E3C83d7710DE9a993dac8bBC990e459e3865";

//创建一个新的钱包账户
export const createNewWallet = async () => {
  const keyring = new Keyring({ type: "sr25519" });
  const mnemonic = mnemonicGenerate();
  const normalWallet = keyring.addFromUri(mnemonic, { name: "User Default" });
  const password = "password";
  const encodedPrivateKey = normalWallet.encodePkcs8(password);

  // 解锁私钥（需要提供正确的密码）
  // normalWallet.decodePkcs8(password, encodedPrivateKey);

  // 存储私钥和地址到本地存储
  localStorage.setItem(KEY_WALLET_PRIVATE_KEY, JSON.stringify(encodedPrivateKey));
  localStorage.setItem(KEY_WALLET_ADDRESS, normalWallet.address);

  console.log("privateKey key:", encodedPrivateKey);
  console.log("address key:", normalWallet.address);
  console.log("memo word:", mnemonic);

  return normalWallet;
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
      let shareWallet = await getWalletByUid(2);
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

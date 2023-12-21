import Web3 from 'web3';

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            return accounts[0];
        } catch (error) {
            console.error('连接钱包失败：', error);
        }
    } else {
        console.error('未安装MetaMask');
    }
    return null;
};

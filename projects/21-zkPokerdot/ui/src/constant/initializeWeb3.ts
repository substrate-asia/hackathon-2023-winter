import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ElLoading } from 'element-plus'

export async function initializeWeb3() {
    try {
        const allInjected = await web3Enable('my cool dapp');
        if (!allInjected.length) {
            throw new Error('No injected sources available');
        }

        const allAccounts = await web3Accounts();
        console.log(allAccounts, allInjected);
        if (!allAccounts.length) {
            throw new Error('No accounts available');
        }

        const SENDER = allAccounts[0].address;

        const injector = await web3FromAddress(SENDER);
        console.log(injector);

        const wsProvider = new WsProvider('ws://127.0.0.1:9944');
        const api = await ApiPromise.create({ provider: wsProvider });
        console.log("api", api);

        if (!api) {
            throw new Error('Unable to create ApiRx instance');
        }
        const tx = api.tx.templateModule.doSomething(99);
        const result = await tx.signAndSend(SENDER, { signer: injector.signer });
        console.log('result', result);

        return result;
    } catch (error) {
        console.error(error);
        throw error; 
    }
}
export const delay = async(ms:number)=>{
    return new Promise(resolve=> {setTimeout(resolve,ms)});
}

export const loading = async(ms:number,text:string) =>{
    const loading = ElLoading.service({
        lock: true,
        text: text,
        background: 'rgba(0, 0, 0, 0.7)',
      })
    await delay(ms);
    loading.close();
}

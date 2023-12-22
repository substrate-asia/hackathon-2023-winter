// import { ApiPromise, WsProvider } from '@polkadot/api';
// import { web3FromAddress, web3Enable } from '@polkadot/extension-dapp';

export async function listProject(senderAddress: string, projectDetails: any) {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const { web3Enable, web3FromAddress } = await import('@polkadot/extension-dapp');
  const wsProvider = new WsProvider(
    'wss://fraa-flashbox-2036-rpc.a.stagenet.tanssi.network'
  );
  const apiPromise = ApiPromise.create({ provider: wsProvider });
  const api = await apiPromise;
  const extensions = await web3Enable('RealXchange');
  const injector = await web3FromAddress(senderAddress);

  const unsub = await api.tx.communityProject
    .listProject(
      projectDetails.priceAndAmount,
      projectDetails.metadata,
      projectDetails.duration,
      projectDetails.fundingTarget,
      projectDetails.projectMetadata
    )
    .signAndSend(senderAddress, { signer: injector.signer }, (result: any) => {
      console.log(`Current status is ${result.status}`);

      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        unsub();
        console.log('Unsubbed');
      }
    });
}

export async function buyNft(senderAddress: string, purchaseDetails: any) {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const { web3Enable, web3FromAddress } = await import('@polkadot/extension-dapp');
  const wsProvider = new WsProvider(
    'wss://fraa-flashbox-2036-rpc.a.stagenet.tanssi.network'
  );
  const apiPromise = ApiPromise.create({ provider: wsProvider });
  const api = await apiPromise;
  const extensions = await web3Enable('RealXchange');
  const injector = await web3FromAddress(senderAddress);

  const unsub = await api.tx.communityProject
    .buyNft(
      purchaseDetails.collectionId,
      purchaseDetails.nftType,
      purchaseDetails.quantity
    )
    .signAndSend(senderAddress, { signer: injector.signer }, (result: any) => {
      console.log(`Current status is ${result.status}`);

      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        unsub();
      }
    });
}

export async function voteOnMilestone(senderAddress: string, voteDetails: any) {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const { web3Enable, web3FromAddress } = await import('@polkadot/extension-dapp');
  const wsProvider = new WsProvider(
    'wss://fraa-flashbox-2036-rpc.a.stagenet.tanssi.network'
  );
  const apiPromise = ApiPromise.create({ provider: wsProvider });
  const api = await apiPromise;
  const extensions = await web3Enable('RealXchange');
  const injector = await web3FromAddress(senderAddress);

  const unsub = await api.tx.communityProject
    .voteOnMilestone(voteDetails.collectionId, voteDetails.vote)
    .signAndSend(senderAddress, { signer: injector.signer }, (result: any) => {
      console.log(`Current status is ${result.status}`);

      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        unsub();
      }
    });
}

export async function bondToken(senderAddress: string, bondDetails: any) {
  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const { web3Enable, web3FromAddress } = await import('@polkadot/extension-dapp');
  const wsProvider = new WsProvider(
    'wss://fraa-flashbox-2036-rpc.a.stagenet.tanssi.network'
  );
  const apiPromise = ApiPromise.create({ provider: wsProvider });
  const api = await apiPromise;
  const extensions = await web3Enable('RealXchange');
  const injector = await web3FromAddress(senderAddress);

  const unsub = await api.tx.communityProject
    .bondToken(bondDetails.collectionId, bondDetails.amount)
    .signAndSend(senderAddress, { signer: injector.signer }, (result: any) => {
      console.log(`Current status is ${result.status}`);

      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
      } else if (result.status.isFinalized) {
        console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
        unsub();
      }
    });
}

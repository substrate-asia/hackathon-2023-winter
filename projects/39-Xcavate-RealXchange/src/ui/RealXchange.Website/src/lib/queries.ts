import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider(
  'wss://fraa-flashbox-2036-rpc.a.stagenet.tanssi.network'
);
const apiPromise = ApiPromise.create({ provider: wsProvider });

export async function getAvailableNFTs(collectionId: number) {
  const api = await apiPromise;
  const result = await api.query.communityProject.listedNftsOfCollection(collectionId);
  const output = result.toHuman();
  return output; // an array of ids of the remaining NFT's
}

export async function getCollectionMetadata(collectionId: number) {
  const api = await apiPromise;
  const result = await api.query.nfts.collectionMetadataOf(collectionId);
  const output = result.toHuman();
  return output; // output.data should contain the metadata
}

export async function getItemMetadata(collectionId: number, itemId: number) {
  const api = await apiPromise;
  const result = await api.query.nfts.itemMetadataOf(collectionId, itemId);
  const output = result.toHuman();
  return output; // output.data should contain the metadata
}

export async function getProjectDetails(collectionId: number) {
  const api = await apiPromise;
  const result = await api.query.communityProject.ongoingProjects(collectionId);
  const output = result.toHuman();
  return output;

  //   {
  //     projectOwner: 5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw
  //     projectPrice: 10,000
  //     duration: 12
  //     milestones: 12
  //     remainingMilestones: 12
  //     projectBalance: 3,000
  //     projectBondingBalance: 0
  //     launchingTimestamp: 0
  //     strikes: 0
  //     nftTypes: 1
  //     ongoing: false
  //   }
}

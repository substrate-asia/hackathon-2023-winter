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

export async function getAvailableNFTsbyType(collectionId: number, nftType: number) {
  const api = await apiPromise;
  const result = await api.query.communityProject.listedNftTypes(collectionId, nftType);
  const output = result.toHuman();
  return output; // an array of ids of the remaining NFT's for that type
}

export async function getCollectionMetadata(collectionId: number) {
  const api = await apiPromise;
  const result = await api.query.nfts.collectionMetadataOf(collectionId);
  const output = result.toHuman();
  return output; // output.data should contain the metadata
}

export async function getCollection(collectionId: number) {
  const api = await apiPromise;
  const result = await api.query.nfts.collection(collectionId);
  const output = result.toHuman();
  return output; // output.data should contain the metadata
}

export async function getItemMetadata(collectionId: number, itemId: number) {
  const api = await apiPromise;
  const result = await api.query.nfts.itemMetadataOf(collectionId, itemId);
  const output = result.toHuman();
  return output; // output.data should contain the metadata
}

export async function getNextProjectId() {
  const api = await apiPromise;
  const result = await api.query.nfts.nextCollectionId();
  const output = result.toHuman();
  return output;
}

export async function getProjectDetails(collectionId: number) {
  const api = await apiPromise;
  const result = await api.query.communityProject.ongoingProjects(collectionId);
  const output = result.toHuman();
  return output;
}
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

export async function fetchMetadata(projectId: number) {
  const collectionMetadata = await getCollectionMetadata(projectId);
  const itemMetadata = await getItemMetadata(projectId, 1);
  const availableNFTs = await getAvailableNFTs(projectId);
  const projectDetails = await getProjectDetails(projectId);
  const baseProjectDetails = await getCollection(projectId);

  return {
    collectionMetadata,
    itemMetadata,
    availableNFTs,
    projectDetails,
    baseProjectDetails
  };
}

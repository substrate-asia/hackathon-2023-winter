import chains from "@/src/chains.json";
import '@/src/types'
import { dummyAsset } from "@/src/constants";

type NFTMetadata = {
  chain: Chain;
  name: string;
  uri: string;
  amount: number; // We will probably replace this by a BigInt
  asset: MultiAsset;
  // We will use this to say to the chain XCM Exchanger which NFT we are talking about
  instance?: Uint8Array;
  xcmLocation?: any // We need to define how we store the XCM Location
  id: number;
};
export const mockNFTMetadata: NFTMetadata[] = [
  {
    chain: chains["parachain-nfts"],
    name: "Dino",
    uri: "/nft-images/Dino.jpeg",
    asset: dummyAsset,
    amount: 23,
    id: 1,
  },
  {
    chain: chains["parachain-nfts"],
    name: "Bird",
    uri: "/nft-images/bird.png",
    asset: dummyAsset,
    amount: 3,
    id: 2,
  },
  {
    chain: chains["parachain-nfts"],
    name: "Sand Paper",
    uri: "/nft-images/sand.png",
    asset: dummyAsset,
    amount: 1.4,
    id: 3,
  },
  {
    chain: chains["parachain-nfts"],
    name: "PineAnt",
    uri: "/nft-images/ant.png",
    asset: dummyAsset,
    amount: 5.2,
    id: 4,
  },
  {
    chain: chains["parachain-nfts"],
    name: "Scribble Statue",
    uri: "https://images.unsplash.com/photo-1651359583018-c33a287f2530?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    asset: dummyAsset,
    amount: 3.5,
    id: 5,
  },
  {
    chain: chains["parachain-nfts"],
    name: "Rice Robo",
    uri: "https://images.unsplash.com/photo-1694434943114-c8ea2049f781?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    asset: dummyAsset,
    amount: 12,
    id: 6,
  },
  {
    chain: chains["parachain-nfts"],
    name: "Distructo Love",
    uri: "https://images.unsplash.com/photo-1650229785916-2cbfe89c72c8?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    asset: dummyAsset,
    amount: 10,
    id: 7,
  },
  {
    chain: chains["parachain-nfts"],
    name: "What Shape",
    uri: "https://images.unsplash.com/photo-1632201801333-7209bd88e5b1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    asset: dummyAsset,
    amount: 9.1,
    id: 8,
  },
];

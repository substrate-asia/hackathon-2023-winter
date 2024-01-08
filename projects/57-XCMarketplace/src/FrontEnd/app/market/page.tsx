"use client"
import React from "react";
import { Input, Button } from '../../src'
import CardNFT from "@/src/cards/CardNFT";
import { SearchBar } from "@/src/search";
import { mockNFTMetadata } from "../dummy-data/nft-metadata";

const Marketplace = () => {
  return <div className="flex pt-20 flex-col items-center h-screen w-full">
      <SearchBar />
    {/* Listed NFT Previews */}
    <div className="p-14 grid lg:grid-cols-2 xl:grid-cols-3 w-screen gap-4 content-start place-items-center">{
      mockNFTMetadata.map((item,index)=>(<CardNFT key={index} chain={item.chain} name={item.name} amount={item.amount} uri={item.uri} asset={item.asset}/>))
    }
    </div>
  </div>;
};

export default Marketplace;

import { cn } from "@/utils";
import React from "react";

const IPFS_PATH = "https://opensquare.infura-ipfs.io/ipfs/";

export default function IpfsImage({ cid = "", className = "" }) {
  return (
    <img
      src={IPFS_PATH + cid}
      alt=""
      className={cn("w-full h-full", className)}
    />
  );
}

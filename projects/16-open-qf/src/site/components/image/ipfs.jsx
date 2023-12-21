import { cn } from "@/utils";
import React from "react";

const IPFS_PATH = process.env.NEXT_PUBLIC_IPFS_ENDPOINT;

export default function IpfsImage({ cid = "", className = "" }) {
  return (
    <img
      src={IPFS_PATH + cid}
      alt=""
      className={cn("w-full h-full", className)}
    />
  );
}

import { Web3PluginBase } from "web3";

import { BlockHash, BlockNumber } from "@polkadot/types/interfaces";
import { RpcApiFlattened, RpcApiSimplified } from "./web3js-polkadot-api";
import { AnyNumber } from "@polkadot/types/types";




export class PolkadotPlugin 
  extends Web3PluginBase<RpcApiFlattened> 
  implements Partial<RpcApiSimplified> 
{
  public pluginNamespace = "polkadot";
  
  constructor() {
    super();
  }

  // It would never be like this in the future
  // This is just to check that the plugin is working and that the provider is set
  // In the future the types from interfaces/augment-api.ts will be used to dynamically generate the rpc methods categorized by namespaces
  public get chain() {
    return {
      getBlock: (hash?: BlockHash | string | Uint8Array) => {
        return this.requestManager.send({
          method: "chain_getBlock", 
          params: [hash] 
        });
      },
      getBlockHash: (blockNumber?: BlockNumber | AnyNumber | undefined) => {
        return this.requestManager.send({
          method: "chain_getBlockHash", 
          params: [blockNumber] 
        });
      },
      getFinalizedHead: () => {
        return this.requestManager.send({
          method: "chain_getFinalizedHead"
        });
      },
      getHeader: (hash?: BlockHash | string | Uint8Array) => {
        return this.requestManager.send({
          method: "chain_getHeader", 
          params: [hash] 
        });
      },
      subscribeAllHeads: () => {
        return this.requestManager.send({
          method: "chain_subscribeAllHeads"
        });
      },
      subscribeFinalizedHeads: () => {
        return this.requestManager.send({
          method: "chain_subscribeFinalizedHeads"
        });
      },
      subscribeNewHeads: () => {
        return this.requestManager.send({
          method: "chain_subscribeNewHeads"
        });
      },
    };
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    polkadot: PolkadotPlugin;
  }
}

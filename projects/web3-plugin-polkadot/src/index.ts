import { Web3PluginBase } from "web3";

import { PolkadotAPI } from "./polkadot-api";
import { BlockHash } from "@polkadot/types/interfaces";
import { Observable } from "@polkadot/types/types";


export class PolkadotPlugin extends Web3PluginBase<PolkadotAPI> {
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
        const response = this.requestManager.send({
          method: "chain_getBlock", 
          params: [hash] 
        });

        // A transformation from type:
        // Promise<Observable<SignedBlock>> that is used by polkadot-types-from-chain,
        // to the actual type returned by web3, that is Promise<SignedBlock>
        // a modification might be done later at polkadot-types-from-chain to give the type compatible with web3 directly
        return response as unknown as typeof response extends Promise<Observable<infer U>> ? Promise<U> : never;
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

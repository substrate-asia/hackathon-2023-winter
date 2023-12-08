import { BlockHash, SignedBlock } from "@polkadot/types/interfaces";
import { Observable } from "@polkadot/types/types";


// It would never be like this in the future
// This is just to check the plugin basic setup
// In the future the types from interfaces/augment-api.ts will be transformed and used dynamically
export declare type PolkadotAPI = { 
    chain_getBlock: (hash?: BlockHash | string | Uint8Array) => Observable<SignedBlock>;
  }
  
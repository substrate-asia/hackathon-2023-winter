import { Web3PluginBase } from 'web3';

import { RpcApiFlattened, RpcApiSimplified } from './web3js-polkadot-api';
import { RpcList } from './interfaces/augment-api-rpc';

export class PolkadotPlugin extends Web3PluginBase<RpcApiFlattened> {
  // implements RpcApiSimplified
  public pluginNamespace = 'polkadot';

  /**
   * Dynamically create Rpc callers organized inside namespaces and assign them to the class
   * This is equivalent to having a code like this for every endpoint:
   * ```  
      public get chain(): RpcApiSimplified["chain"] {
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
          ...
        };
      }
      ...
    * ```
   */
  private createRpcMethods(rpcList: typeof RpcList) {
    const objectKeys = Object.keys(rpcList) as Array<keyof typeof rpcList>;
    for (let rpcNamespace of objectKeys) {
      const endpointNames = rpcList[rpcNamespace];
      const endPoints: any = {};
      for (let endpointName of endpointNames) {
        endPoints[endpointName] = (args: any) =>
          this.requestManager.send({
            method: `${rpcNamespace}_${endpointName}`,
            params: [args],
          });
      }
      (this as unknown as RpcApiSimplified)[rpcNamespace] = endPoints;
    }
  }

  // The following commented code contains experiments with using index signature instead of using the method `createRpcMethods`.
  // Left for revisit later...
  // And that would need the constructor to have at the end: `return new Proxy(this, PolkadotPlugin.indexedHandler);`
  // // Index signature to allow indexing the class using a string
  // [rpcNamespace: (string | symbol)]: RpcInterface[RpcApiNamespaces] | any;
  // Or something like: [rpcNamespace: keyof RpcApiSimplified]: PickMethods<typeof rpcNamespace>;
  // Or something like: [rpcNamespace: keyof typeof RpcList]: RpcApiSimplified[typeof rpcNamespace];

  // private static indexedHandler: ProxyHandler<PolkadotPlugin> = {
  //   get(target: PolkadotPlugin,
  //     property: RpcApiNamespaces,
  //     receiver: any) {
  //       if(target[property]){
  //         return target[property]
  //       }

  //       if(property in Object.keys(RpcList)) {
  //         console.log(receiver)
  //         const response = new PolkadotPlugin().requestManager.send({
  //           method: `${property}_${receiver}}`,
  //           params: [receiver]
  //         });
  //         return response;
  //       }

  //     return target[property];
  //   }
  // };

  constructor() {
    super();

    this.createRpcMethods(RpcList);
  }
}

// Module Augmentation
declare module 'web3' {
  interface Web3Context {
    // it seems a bit hacky. Revisit this in the future and possibly use generics instead.
    polkadot: PolkadotPlugin & RpcApiSimplified;
  }
}

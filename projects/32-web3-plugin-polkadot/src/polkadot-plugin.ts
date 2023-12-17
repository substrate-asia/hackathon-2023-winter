import { Web3PluginBase } from 'web3';

import { KusamaRpcApiSimplified, PolkadotRpcApiSimplified, RpcApiFlattened, SubstrateRpcApiSimplified } from './web3js-polkadot-api';
import { SubstrateRpcList } from './interfaces/substrate/augment-api-rpc';
import { KusamaRpcList } from './interfaces/kusama/augment-api-rpc';
import { PolkadotRpcList } from './interfaces/polkadot/augment-api-rpc';


export class PolkadotPlugin extends Web3PluginBase<RpcApiFlattened> {
  public pluginNamespace = 'polka';

  /**
   * Dynamically create Rpc callers organized inside namespaces and return them
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
  private createRpcMethods(rpcList: Record<string, any>) {
    const returnedRpcMethods: Record<string, any> = {}
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
      returnedRpcMethods[rpcNamespace] = endPoints;
    }
    return returnedRpcMethods;
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

  public polkadot: SubstrateRpcApiSimplified;
  public kusama: SubstrateRpcApiSimplified;
  public substrate: SubstrateRpcApiSimplified;

  constructor() {
    super();

    this.polkadot = this.createRpcMethods(PolkadotRpcList) as PolkadotRpcApiSimplified;
    this.kusama = this.createRpcMethods(KusamaRpcList) as KusamaRpcApiSimplified;
    this.substrate = this.createRpcMethods(SubstrateRpcList) as SubstrateRpcApiSimplified;
  }
}

// Module Augmentation
declare module 'web3' {
  interface Web3Context {
    // This seems a bit hacky. Revisit this in the future and possibly use generics instead.
    polka : PolkadotPlugin
  }
}

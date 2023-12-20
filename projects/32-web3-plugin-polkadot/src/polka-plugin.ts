import { Web3PluginBase } from 'web3';

import {
  PolkadotSimpleRpcInterfaceFiltered,
  KusamaSimpleRpcInterfaceFiltered,
  SubstrateSimpleRpcInterfaceFiltered,
} from './types/web3.js-friendly/simple-rpc-interfaces-filtered';

import { PolkadotRpcList } from './interfaces/polkadot/augment-api-rpc';
import { KusamaRpcList } from './interfaces/kusama/augment-api-rpc';
import { SubstrateRpcList } from './interfaces/substrate/augment-api-rpc';

import {
  PolkadotRpcInterfaceFlatFiltered,
  KusamaRpcInterfaceFlatFiltered,
  SubstrateRpcInterfaceFlatFiltered,
} from './types/web3.js-friendly/simple-rpc-interfaces-flat-filtered';

import { PolkadotSupportedRpcMethods } from './types/polkadot/supported-rpc-methods';
import { KusamaSupportedRpcMethods } from './types/kusama/supported-rpc-methods';
import { SubstrateSupportedRpcMethods } from './types/substrate/supported-rpc-methods';

// The generic types: PolkadotRpcInterfaceFlatFiltered | KusamaRpcInterfaceFlatFiltered | SubstrateRpcInterfaceFlatFiltered,
// enables having strongly typed variables returned when calling `this.requestManager.send`.
// For example:
// const res = // res will automatically  be of type `Promise<SignedBlock>
//   this.requestManager.send({
//     method: `chain_getBlock`,
//     params: [],
//   });
export class PolkaPlugin extends Web3PluginBase<
  PolkadotRpcInterfaceFlatFiltered | KusamaRpcInterfaceFlatFiltered | SubstrateRpcInterfaceFlatFiltered
> {
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
  private createRpcMethods(rpcList: Record<string, readonly string[]>, supported: readonly string[]) {
    const returnedRpcMethods: Record<string, any> = {};
    const objectKeys = Object.keys(rpcList) as Array<keyof typeof rpcList>;
    for (let rpcNamespace of objectKeys) {
      const endpointNames = rpcList[rpcNamespace];
      const endPoints: any = {};
      for (let endpointName of endpointNames) {
        if (!supported.includes(`${rpcNamespace}_${endpointName}`)) {
          continue;
        }
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
  // And that would need the constructor to have at the end: `return new Proxy(this, PolkaPlugin.indexedHandler);`
  // // Index signature to allow indexing the class using a string
  // [rpcNamespace: (string | symbol)]: RpcInterface[RpcApiNamespaces] | any;
  // Or something like: [rpcNamespace: keyof RpcApiSimplified]: PickMethods<typeof rpcNamespace>;
  // Or something like: [rpcNamespace: keyof typeof RpcList]: RpcApiSimplified[typeof rpcNamespace];

  // private static indexedHandler: ProxyHandler<PolkaPlugin> = {
  //   get(target: PolkaPlugin,
  //     property: RpcApiNamespaces,
  //     receiver: any) {
  //       if(target[property]){
  //         return target[property]
  //       }

  //       if(property in Object.keys(RpcList)) {
  //         console.log(receiver)
  //         const response = new PolkaPlugin().requestManager.send({
  //           method: `${property}_${receiver}}`,
  //           params: [receiver]
  //         });
  //         return response;
  //       }

  //     return target[property];
  //   }
  // };

  public polkadot: PolkadotSimpleRpcInterfaceFiltered;
  public kusama: KusamaSimpleRpcInterfaceFiltered;
  public substrate: SubstrateSimpleRpcInterfaceFiltered;

  constructor() {
    super();

    this.polkadot = this.createRpcMethods(
      PolkadotRpcList,
      PolkadotSupportedRpcMethods
    ) as PolkadotSimpleRpcInterfaceFiltered;
    this.kusama = this.createRpcMethods(KusamaRpcList, KusamaSupportedRpcMethods) as KusamaSimpleRpcInterfaceFiltered;
    this.substrate = this.createRpcMethods(
      SubstrateRpcList,
      SubstrateSupportedRpcMethods
    ) as SubstrateSimpleRpcInterfaceFiltered;
  }
}

// Module Augmentation
declare module 'web3' {
  interface Web3 {
    // This seems a bit hacky. Revisit this in the future and possibly use generics instead.
    polka: Omit<PolkaPlugin, keyof Web3PluginBase>;
    // The following could be used instead of the above to disable PolkaPlugin inherited methods.
    // However a solution using generics, instead of module augmentation, will be done later at web3.js and then used here.
    // polka: {
    //   polkadot: PolkadotSimpleRpcInterfaceFiltered;
    //   kusama: KusamaSimpleRpcInterfaceFiltered;
    //   substrate: SubstrateSimpleRpcInterfaceFiltered;
    // };
  }
}

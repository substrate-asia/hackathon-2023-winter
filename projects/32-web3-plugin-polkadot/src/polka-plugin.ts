import { Web3, Web3PluginBase } from 'web3';

import {
  PolkadotSimpleRpcInterfaceFiltered,
  KusamaSimpleRpcInterfaceFiltered,
  SubstrateSimpleRpcInterfaceFiltered,
} from './types/web3.js-friendly/simple-rpc-interfaces-filtered';

import {
  PolkadotRpcInterfaceFlatFiltered,
  KusamaRpcInterfaceFlatFiltered,
  SubstrateRpcInterfaceFlatFiltered,
} from './types/web3.js-friendly/simple-rpc-interfaces-flat-filtered';

import { PolkadotSupportedRpcMethods } from './types/constants/polkadot-supported-rpc-methods';
import { KusamaSupportedRpcMethods } from './types/constants/kusama-supported-rpc-methods';
import { SubstrateSupportedRpcMethods } from './types/constants/substrate-supported-rpc-methods';
import { Filter } from './types/web3.js-friendly/filter-transformers';
import { SubstrateSimpleRpcInterface } from './interfaces/substrate/augment-api-rpc';

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
   * Dynamically create Rpc callers organized inside namespaces and return them.
   * @param supported a flat array of supported rpcs to be used to create the rpc callers. For example: `["chain_getBlock", "chain_getBlockHash", ...]`
   * @returns Rpc callers organized inside namespaces
   * @note This is a simplified version of the `createRpcMethods` method.
   * It is used to create the `polkadot`, `kusama` and `substrate` namespaces.
   * And any other custom namespace.
   * The function is equivalent to having a code like this for every endpoint:
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
  private createRpcMethods<T>(supportedRpcs: readonly string[]) {
    const returnedRpcMethods: Record<string, any> = {};
    const objectKeys = supportedRpcs.map((rpc) => rpc.split('_', 2)[0]);
    for (let rpcNamespace of objectKeys) {
      const endpointNames = supportedRpcs.map((rpc) => rpc.split('_', 2)[1]);
      const endPoints: any = {};
      for (let endpointName of endpointNames) {
        if (!supportedRpcs.includes(`${rpcNamespace}_${endpointName}`)) {
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
    return returnedRpcMethods as T;
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

  public polkadot: { rpc: PolkadotSimpleRpcInterfaceFiltered };
  public kusama: { rpc: KusamaSimpleRpcInterfaceFiltered };
  public substrate: { rpc: SubstrateSimpleRpcInterfaceFiltered };

  constructor() {
    super();
    this.polkadot = {
      rpc: this.createRpcMethods(PolkadotSupportedRpcMethods),
    };
    this.kusama = {
      rpc: this.createRpcMethods(KusamaSupportedRpcMethods),
    };
    this.substrate = {
      rpc: this.createRpcMethods(SubstrateSupportedRpcMethods),
    };
  }

  /**
   * Register the plugin with web3 and return the web3 instance.
   * @note There would be some work to refactor and enhance the typescript types for `registerAt`. Or possibly refactor web3.registerPlugin for the matter.
   * @param web3
   * @param pluginNamespace
   * @param supportedRpcs
   * @returns web3 instance with the plugin registered
   */
  public registerAt<
    NameSpace extends string,
    TypeOfSupportedRpcs extends readonly string[],
    // SimpleRpcInterface is identical, at least at this moment for all networks.
    // So, it is fair enough to use SubstrateSimpleRpcInterface as the default.
    T extends Record<string, any> = SubstrateSimpleRpcInterface
  >(
    web3: Web3,
    pluginNamespace: NameSpace,
    supportedRpcs: TypeOfSupportedRpcs
  ): Web3 & { polka: Record<NameSpace, { rpc: Filter<T, typeof supportedRpcs> }> } {
    (this as any)[pluginNamespace] = { rpc: this.createRpcMethods(supportedRpcs) };

    web3.registerPlugin(this);
    return web3 as Web3 & { polka: Record<NameSpace, { rpc: Filter<T, typeof supportedRpcs> }> };
  }
}

// Using Module Augmentation seems a bit hacky. Revisit this in the future and possibly use generics instead.
declare module 'web3' {
  interface Web3 {
    polka: {
      polkadot: {
        rpc: PolkadotSimpleRpcInterfaceFiltered;
      };
      kusama: {
        rpc: KusamaSimpleRpcInterfaceFiltered;
      };
      substrate: {
        rpc: SubstrateSimpleRpcInterfaceFiltered;
      };
    };
  }
}

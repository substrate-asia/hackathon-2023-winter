/**
 * This file contains typescript transformers and types that are not used at the moment.
 * But they are left as they are related to exploring the best way for dynamic typings.
 */

import { Observable } from '@polkadot/types/types';

import { AugmentedRpc } from '@polkadot/rpc-core/types';
import { RpcInterface } from '@polkadot/rpc-core/types/jsonrpc';

import { PolkadotRpcInterface, KusamaRpcInterface, SubstrateRpcInterface } from '@polkadot/rpc-core/types/jsonrpc';

// Following steps could be used to the rpc interfaces to a web3.js friendly typescript interfaces but with keeping the nested structure.
// And does not filter the methods to only include the supported ones.
// The transformers simply remove the `AugmentedRpc` type and replace `Observable` with `Promise`.

// However, the generic-transomed types was replaced by hard coded types that are available with:
// import { <network>SimpleRpcInterface } from '../interfaces/<network>/augment-api-rpc';
// Because the generic types are not very indicative when the developer hover over the type for example.
// But, they are kept here for reference and to possibly use them again later.

// Types to transforms from `AugmentedRpc<(...args) => Observable<ReturnType>>` to `(...args) => Promise<ReturnType>`
type ReplaceObservableByPromise<T> = T extends (...args: infer A) => Observable<infer U>
  ? (...args: A) => Promise<U>
  : never;
type RemoveAugmentAtFunctions<Namespace> = {
  [Func in keyof Namespace]: Namespace[Func] extends AugmentedRpc<infer F> ? ReplaceObservableByPromise<F> : never;
};
type RemoveAugment<T> = {
  [Namespace in keyof T]: RemoveAugmentAtFunctions<T[Namespace]>;
};

// The following generic-transomed types was replaced by hard coded types.
// Because the generic types are not very indicative when the developer hover over the type for example.
// However, they are kept here for reference and to possibly use them again later.
export type PolkadotTransformedRpcApi = RemoveAugment<PolkadotRpcInterface>; // The same as PolkadotSimpleRpcInterface from './kusama/supported-rpc-methods'
export type KusamaTransformedRpcApi = RemoveAugment<KusamaRpcInterface>; // The same as KusamaSimpleRpcInterface from './polkadot/supported-rpc-methods'
export type SubstrateTransformedRpcApi = RemoveAugment<SubstrateRpcInterface>; // The same as SubstrateSimpleRpcInterface from './substrate/supported-rpc-methods'

// ----------------------------------------------------------------------------------------------------------
// the next types are also not used yet, they are left as they are related to exploring the best way for dynamic typings...

// This type could be used to remove the `AugmentedRpc` type from the rpc interface.
// And, also, replace Observables with Promises.
// However, it keeps the types nested inside the namespaces.
type RpcApiSimplified = RemoveAugment<RpcInterface>;

export type PickMethods<NameSpace extends keyof RpcApiSimplified> = RpcApiSimplified[NameSpace];

// The `type chainMethods = PickMethods<"chain">` is equivalent to:
//type chainMethods = {
//   getBlock: (hash?: string | BlockHash | Uint8Array | undefined) => Promise<SignedBlock>;
//   getBlockHash: (blockNumber?: BlockNumber | AnyNumber | undefined) => Promise<...>;
//   ... 4 more ...;
//   subscribeNewHeads: () => Promise<...>;
// }

// ----------------------------------------------------------------------------------------------------------
// the next types are also not used yet, they are left as they are related to exploring the best way for dynamic typings...

// the following gives: type RpcApiNamespaces = "author" | "babe" | "beefy" | "chain" | ... | "web3"
export type PolkadotRpcApiNamespaces = keyof PolkadotRpcInterface & string;
export type KusamaRpcApiNamespaces = keyof KusamaRpcInterface & string;
export type SubstrateRpcApiNamespaces = keyof SubstrateRpcInterface & string;

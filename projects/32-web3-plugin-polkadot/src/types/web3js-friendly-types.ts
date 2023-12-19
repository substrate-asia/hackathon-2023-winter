import { AugmentedRpc } from '@polkadot/rpc-core/types';
import { RpcInterface } from '@polkadot/rpc-core/types/jsonrpc';
import { Observable } from '@polkadot/types/types';
import { PolkadotRpcInterface, KusamaRpcInterface, SubstrateRpcInterface } from '@polkadot/rpc-core/types/jsonrpc'


// types to prefix the rpc interface for methods (methods are located inside the namespaces. here just the namespaces are prefixed to every method)
type AppendNameSpace<Namespace, NamespaceName> = {
  [Func in keyof Namespace as `${NamespaceName & string}_${Func & string}`]: Namespace[Func];
};
type PrefixSubByNameSpace<T> = {
  [Namespace in keyof T]: AppendNameSpace<T[Namespace], Namespace>;
};


// types to flatten the rpc interface because it is a 2 level nested inside the rpc interface
type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T> = Exclude<Extract<ValuesOf<T>, object>, Array<any>>;
type FlattenUnion<T> = T extends any
  ? {
      [P in keyof T]: T[P] extends (...args: infer A) => Observable<infer U> ? (...args: A) => U : never;
    }
  : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type Flatten<T> = T extends any ? UnionToIntersection<FlattenUnion<ObjectValuesOf<T>>> : never;


// Transformation from `{ namespace.method }` to `{ namespace.namespace_method }`:
type PolkadotPrefixed = PrefixSubByNameSpace<PolkadotRpcInterface>;
type KusamaPrefixed = PrefixSubByNameSpace<KusamaRpcInterface>;
type SubstratePrefixed = PrefixSubByNameSpace<SubstrateRpcInterface>;
// Transformation from `{ namespace.namespace_method }` to `{ namespace_method }`:
export type PolkadotRpcApiFlattened = Flatten<PolkadotPrefixed>;
export type KusamaRpcApiFlattened = Flatten<KusamaPrefixed>;
export type SubstrateRpcApiFlattened = Flatten<SubstratePrefixed>;



// To be compatible with web3.js, the above transforms the following rpc interface:
// interface RpcInterface {
//   author: {
//     /**
//      * Returns true if the keystore has private keys for the given public key and key type.
//      **/
//     hasKey: AugmentedRpc<(publicKey: Bytes | string | Uint8Array, keyType: Text | string) => Observable<bool>>;
//     /**
//      * Returns true if the keystore has private keys for the given session public keys.
//      **/
//     hasSessionKeys: AugmentedRpc<(sessionKeys: Bytes | string | Uint8Array) => Observable<bool>>;
//     /**
//      * Insert a key into the keystore.
//      **/

//     //... the reset of the definitions
//   };
//   babe: {
//     /**
//      * Returns data about which slots (primary or secondary) can be claimed in the current epoch with the keys in the keystore
//      **/
//     epochAuthorship: AugmentedRpc<() => Observable<HashMap<AuthorityId, EpochAuthorship>>>;
//   };

//   chain: {
//     /**
//      * Get header and body of a relay chain block
//      **/
//     getBlock: AugmentedRpc<(hash?: BlockHash | string | Uint8Array) => Observable<SignedBlock>>;

//     //... the reset of the definitions
//   };

//   // ...other namespaces would be here
// }

// into this type:
// type Web3CompatibleSubstrateApi = {
//   author_hasKey: (publicKey: string | Uint8Array | Bytes, keyType: string | Text) => bool;
//   author_hasSessionKeys: (sessionKeys: string | Uint8Array | Bytes) => bool;
//   ...
//   babe_epochAuthorship: () => HashMap<AuthorityId, EpochAuthorship>;
//   ...
//   chain_getBlock: (hash?: string | Uint8Array | Bytes) => Object;
// }

// ----------------------------------------------------------------------------------------------------------

// types to transforms from `AugmentedRpc<(...args) => Observable<ReturnType>>` to `(...args) => Promise<ReturnType>`
type ReplaceObservableByPromise<T> = T extends (...args: infer A) => Observable<infer U>
  ? (...args: A) => Promise<U>
  : never;
type RemoveAugmentAtFunctions<Namespace> = {
  [Func in keyof Namespace]: Namespace[Func] extends AugmentedRpc<infer F> ? ReplaceObservableByPromise<F> : never;
};
export type RemoveAugment<T> = {
  [Namespace in keyof T]: RemoveAugmentAtFunctions<T[Namespace]>;
};
// This type is used to remove the `AugmentedRpc` type from the rpc interface.
// And, also, replace Observables with Promises.
// However, it keeps the types nested inside the namespaces.
export type RpcApiSimplified = RemoveAugment<RpcInterface>;

// The following generic-transomed types was replaced by hard coded types,
// because the generic types are not very indicative when the developer hover over the type for example!
// However, they are kept here for reference and to possibly use them again later.
export type PolkadotTransformedRpcApi = RemoveAugment<PolkadotRpcInterface>; // The same as PolkadotSimpleRpcInterface
export type KusamaTransformedRpcApi = RemoveAugment<KusamaRpcInterface>; // The same as KusamaSimpleRpcInterface
export type SubstrateTransformedRpcApi = RemoveAugment<SubstrateRpcInterface>; // The same as SubstrateSimpleRpcInterface


// ----------------------------------------------------------------------------------------------------------
// the next types may not be used yet, they are left as they are related to exploring the best way for dynamic typings...

export type PickMethods<NameSpace extends keyof RpcApiSimplified> = RpcApiSimplified[NameSpace];

// The `type chainMethods = PickMethods<"chain">` is equivalent to:
//type chainMethods = {
//   getBlock: (hash?: string | BlockHash | Uint8Array | undefined) => Promise<SignedBlock>;
//   getBlockHash: (blockNumber?: BlockNumber | AnyNumber | undefined) => Promise<...>;
//   ... 4 more ...;
//   subscribeNewHeads: () => Promise<...>;
// }

// ----------------------------------------------------------------------------------------------------------
// the next types may not be used yet, they are left as they are related to exploring the best way for dynamic typings...

// the following gives: type RpcApiNamespaces = "author" | "babe" | "beefy" | "chain" | ... | "web3"
export type RpcApiNamespaces = keyof RpcInterface & string;

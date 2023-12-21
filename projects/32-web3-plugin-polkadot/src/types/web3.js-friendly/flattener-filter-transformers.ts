/**
 * This file contains utility types for transforming and filtering a nested RPC interface to a web3.js friendly TypeScript interface.
 * The types in this file are used to prefix namespaces to methods, flatten the interface, and filter the methods to include only the supported ones.
 * The resulting interface is compatible with web3.js and can be used to provide IntelliSense for the Web3PluginBase.
 *
 * @module FlattenerFilterTransformers
 */

import { Observable } from '@polkadot/types/types';

/**
 * Utility type to prefix the rpc interface for methods. (because, methods are located inside the namespaces)
 * With this type, each method is prefixed with the corresponding namespace name.
 */
type AppendNameSpace<Namespace, NamespaceName> = {
  [Func in keyof Namespace as `${NamespaceName & string}_${Func & string}`]: Namespace[Func];
};

/**
 * Utility type to prefix sub-namespaces to methods.
 */
type PrefixSubByNameSpace<T> = {
  [Namespace in keyof T]: AppendNameSpace<T[Namespace], Namespace>;
};

type ValuesOf<T> = T[keyof T];
type ObjectValuesOf<T> = Exclude<Extract<ValuesOf<T>, object>, Array<any>>;
type FlattenUnion<T> = T extends any
  ? {
      [P in keyof T]: T[P] extends (...args: infer A) => Observable<infer U> ? (...args: A) => U : never;
    }
  : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
/**
 * Utility type to flatten the rpc interface because it is a 2 level nested inside the rpc interface.
 */
type Flattener<T> = T extends any ? UnionToIntersection<FlattenUnion<ObjectValuesOf<T>>> : never;

// To do a Transformation from `{ namespace.method }` to `{ namespace.namespace_method }`:
// type PolkadotPrefixed = PrefixSubByNameSpace<PolkadotRpcInterface>;
// type KusamaPrefixed = PrefixSubByNameSpace<KusamaRpcInterface>;
// type SubstratePrefixed = PrefixSubByNameSpace<SubstrateRpcInterface>;

// To do a Transformation from `{ namespace.namespace_method }` to `{ namespace_method }`:
// type PolkadotRpcInterfaceFlattened = Flatten<PolkadotPrefixed>;
// type KusamaRpcInterfaceFlattened = Flatten<KusamaPrefixed>;
// type SubstrateRpcInterfaceFlattened = Flatten<SubstratePrefixed>;

/**
 * Utility type to filter the flattened interface to only include the supported methods.
 */
type FilterAFlattenedInterface<T, Methods extends readonly string[]> = {
  [P in keyof T as P extends Methods[number] ? P : never]: T[P];
};

/**
 * The types in this file are used to transform the nested RPC interface into a flattened, web3.js friendly TypeScript interface.
 * This transformation involves several steps:
 * 1. Removing the `AugmentedRpc` type and replacing `Observable` with `Promise`.
 * 2. Prefixing the namespaces to the methods.
 * 3. Filtering the methods to only include the supported ones.
 *
 * @example
 * For instance, given the following RPC interface:
 * ```ts
 * interface RpcInterface {
 *   author: {
 *     hasKey: AugmentedRpc<(publicKey: Bytes | string | Uint8Array, keyType: Text | string) => Observable<bool>>;
 *     hasSessionKeys: AugmentedRpc<(sessionKeys: Bytes | string | Uint8Array) => Observable<bool>>;
 *     // ... other definitions
 *   };
 *   // ... other namespaces
 * }
 * ```
 * Will be transformed it into the following web3.js compatible TypeScript interface:
 * ```ts
 * type Web3CompatibleRpcInterface = {
 *   author_hasKey: (publicKey: string | Uint8Array | Bytes, keyType: string | Text) => Promise<bool>;
 *   author_hasSessionKeys: (sessionKeys: string | Uint8Array | Bytes) => Promise<bool>;
 *   // ... other definitions
 *   // note that, for example, `babe_...` will be removed for Substrate but kept for Polkadot and Kusama.
 *   babe_epochAuthorship: () => Promise<HashMap<AuthorityId, EpochAuthorship>>;
 * }
 * ```
 */
export type FlattenerFilter<T, Supported extends readonly string[]> = FilterAFlattenedInterface<
  Flattener<PrefixSubByNameSpace<T>>,
  Supported
>;

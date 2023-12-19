import { PolkadotRpcApiFlattened, KusamaRpcApiFlattened, SubstrateRpcApiFlattened } from './web3js-friendly-types';

import {
  PolkadotSimpleRpcInterface,
  KusamaSimpleRpcInterface,
  SubstrateSimpleRpcInterface,
} from '@polkadot/rpc-core/types/jsonrpc';

import { KusamaSupportedRpcMethods } from './kusama/supported-rpc-methods';
import { PolkadotSupportedRpcMethods } from './polkadot/supported-rpc-methods';
import { SubstrateSupportedRpcMethods } from './substrate/supported-rpc-methods';

// Filter the type RpcApiFlattened to only include the supported methods
type FilterFlatRpc<T, Methods extends readonly string[]> = {
  [P in keyof T as P extends Methods[number] ? P : never]: T[P];
};

export type PolkadotRpcApiFlatFiltered = FilterFlatRpc<PolkadotRpcApiFlattened, typeof PolkadotSupportedRpcMethods>;
export type KusamaRpcApiFlatFiltered = FilterFlatRpc<KusamaRpcApiFlattened, typeof KusamaSupportedRpcMethods>;
export type SubstrateRpcApiFlatFiltered = FilterFlatRpc<SubstrateRpcApiFlattened, typeof SubstrateSupportedRpcMethods>;

// Filter the type RpcApiFlattened to only include the supported methods

type FilteredNestedRpcApi<T, Methods extends readonly string[]> = {
  [P in keyof T]: {
    [K in keyof T[P] as `${P & string}_${K & string}` extends Methods[number] ? K : never]: T[P][K];
  };
};

export type PolkadotSimpleRpcInterfaceFiltered = FilteredNestedRpcApi<
  PolkadotSimpleRpcInterface,
  typeof PolkadotSupportedRpcMethods
>;
export type KusamaSimpleRpcInterfaceFiltered = FilteredNestedRpcApi<
  KusamaSimpleRpcInterface,
  typeof KusamaSupportedRpcMethods
>;
export type SubstrateSimpleRpcInterfaceFiltered = FilteredNestedRpcApi<
  SubstrateSimpleRpcInterface,
  typeof SubstrateSupportedRpcMethods
>;

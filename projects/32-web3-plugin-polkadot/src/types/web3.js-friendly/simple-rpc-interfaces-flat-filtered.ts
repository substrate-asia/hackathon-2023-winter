// Note that as alternative to the next 3 imports, we can use the following imports:
// import { <network>SimpleRpcInterface } from '../interfaces/<network>/augment-api-rpc';
// However, the following imports are kept as the are the original ones generated by the `typegen` command, without any need for custom modification.
// And there is no need to change them to the modified ones. However, this can be changed later if needed.
import { PolkadotRpcInterface, KusamaRpcInterface, SubstrateRpcInterface } from '@polkadot/rpc-core/types/jsonrpc';

import { KusamaSupportedRpcMethods } from '../constants/kusama-supported-rpc-methods';
import { PolkadotSupportedRpcMethods } from '../constants/polkadot-supported-rpc-methods';
import { SubstrateSupportedRpcMethods } from '../constants/substrate-supported-rpc-methods';
import { FlattenerFilter } from './flattener-filter-transformers';

export type PolkadotRpcInterfaceFlatFiltered = FlattenerFilter<
  PolkadotRpcInterface,
  typeof PolkadotSupportedRpcMethods
>;
export type KusamaRpcInterfaceFlatFiltered = FlattenerFilter<KusamaRpcInterface, typeof KusamaSupportedRpcMethods>;
export type SubstrateRpcInterfaceFlatFiltered = FlattenerFilter<
  SubstrateRpcInterface,
  typeof SubstrateSupportedRpcMethods
>;

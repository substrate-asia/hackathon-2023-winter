import { PolkadotSimpleRpcInterface } from '../../interfaces/polkadot/augment-api-rpc';
import { KusamaSimpleRpcInterface } from '../../interfaces/kusama/augment-api-rpc';
import { SubstrateSimpleRpcInterface } from '../../interfaces/substrate/augment-api-rpc';

import { KusamaSupportedRpcMethods } from '../constants/kusama-supported-rpc-methods';
import { PolkadotSupportedRpcMethods } from '../constants/polkadot-supported-rpc-methods';
import { SubstrateSupportedRpcMethods } from '../constants/substrate-supported-rpc-methods';
import { Filter } from './filter-transformers';

export type PolkadotSimpleRpcInterfaceFiltered = Filter<PolkadotSimpleRpcInterface, typeof PolkadotSupportedRpcMethods>;
export type KusamaSimpleRpcInterfaceFiltered = Filter<KusamaSimpleRpcInterface, typeof KusamaSupportedRpcMethods>;
export type SubstrateSimpleRpcInterfaceFiltered = Filter<
  SubstrateSimpleRpcInterface,
  typeof SubstrateSupportedRpcMethods
>;

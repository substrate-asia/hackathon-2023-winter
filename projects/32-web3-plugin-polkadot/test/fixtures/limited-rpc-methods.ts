/**
 * An array containing a limited list of rpc methods. Used for testing.
 * It is supposed to be generated from a local dev node
 * using a code like the following:
  ```
  const web3 = new Web3('ws://127.0.0.1:9944/');
  web3.registerPlugin(new PolkaPlugin());
  const response = await web3.polka.substrate.rpc.methods();
  console.log(JSON.stringify(response.methods, null, 2));
  ```
 */
export const MyLimitedNodeRpcMethods = [
  'chain_getBlock',
  'chain_getBlockHash',
  'chain_getFinalisedHead',
  'chain_getFinalizedHead',
  'chain_getHead',
  'chain_getHeader',
  'chain_getRuntimeVersion',
  'chain_subscribeAllHeads',
  'chain_subscribeFinalisedHeads',
  'chain_subscribeFinalizedHeads',
  'chain_subscribeNewHead',
  'chain_subscribeNewHeads',
  'chain_subscribeRuntimeVersion',
  'chain_unsubscribeAllHeads',
  'chain_unsubscribeFinalisedHeads',
  'chain_unsubscribeFinalizedHeads',
  'chain_unsubscribeNewHead',
  'chain_unsubscribeNewHeads',
  'chain_unsubscribeRuntimeVersion',
  'system_accountNextIndex',
  'system_addLogFilter',
  'system_addReservedPeer',
  'system_chain',
  'system_chainType',
  'system_dryRun',
  'system_dryRunAt',
  'system_health',
  'system_localListenAddresses',
  'system_localPeerId',
  'system_name',
  'system_nodeRoles',
  'system_peers',
  'system_properties',
  'system_removeReservedPeer',
  'system_reservedPeers',
  'system_resetLogFilter',
  'system_syncState',
  'system_unstable_networkState',
  'system_version',
] as const;

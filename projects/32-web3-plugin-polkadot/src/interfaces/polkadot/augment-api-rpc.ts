// this file is auto-generated from a modified template file
// the original template file is '@polkadot/typegen/templates/rpc.hbs'
// and the modification template file is at 'static/type-generation/rpc.hbs'

// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/rpc-core/types/jsonrpc';

import type { AugmentedRpc } from '@polkadot/rpc-core/types';
import type { Metadata, StorageKey } from '@polkadot/types';
import type { Bytes, HashMap, Json, Null, Option, Text, U256, U64, Vec, bool, f64, u32, u64 } from '@polkadot/types-codec';
import type { AnyNumber, Codec } from '@polkadot/types-codec/types';
import type { ExtrinsicOrHash, ExtrinsicStatus } from '@polkadot/types/interfaces/author';
import type { EpochAuthorship } from '@polkadot/types/interfaces/babe';
import type { BeefyVersionedFinalityProof } from '@polkadot/types/interfaces/beefy';
import type { BlockHash } from '@polkadot/types/interfaces/chain';
import type { PrefixedStorageKey } from '@polkadot/types/interfaces/childstate';
import type { AuthorityId } from '@polkadot/types/interfaces/consensus';
import type { CodeUploadRequest, CodeUploadResult, ContractCallRequest, ContractExecResult, ContractInstantiateResult, InstantiateRequestV1 } from '@polkadot/types/interfaces/contracts';
import type { BlockStats } from '@polkadot/types/interfaces/dev';
import type { CreatedBlock } from '@polkadot/types/interfaces/engine';
import type { EthAccount, EthCallRequest, EthFeeHistory, EthFilter, EthFilterChanges, EthLog, EthReceipt, EthRichBlock, EthSubKind, EthSubParams, EthSyncStatus, EthTransaction, EthTransactionRequest, EthWork } from '@polkadot/types/interfaces/eth';
import type { Extrinsic } from '@polkadot/types/interfaces/extrinsics';
import type { EncodedFinalityProofs, JustificationNotification, ReportedRoundStates } from '@polkadot/types/interfaces/grandpa';
import type { MmrHash, MmrLeafBatchProof } from '@polkadot/types/interfaces/mmr';
import type { StorageKind } from '@polkadot/types/interfaces/offchain';
import type { FeeDetails, RuntimeDispatchInfoV1 } from '@polkadot/types/interfaces/payment';
import type { RpcMethods } from '@polkadot/types/interfaces/rpc';
import type { AccountId, BlockNumber, H160, H256, H64, Hash, Header, Index, Justification, KeyValue, SignedBlock, StorageData } from '@polkadot/types/interfaces/runtime';
import type { MigrationStatusResult, ReadProof, RuntimeVersion, TraceBlockResponse } from '@polkadot/types/interfaces/state';
import type { ApplyExtrinsicResult, ChainProperties, ChainType, Health, NetworkState, NodeRole, PeerInfo, SyncState } from '@polkadot/types/interfaces/system';
import type { IExtrinsic, Observable } from '@polkadot/types/types';

export type __AugmentedRpc = AugmentedRpc<() => unknown>;

declare module '@polkadot/rpc-core/types/jsonrpc' {
  interface PolkadotRpcInterface {
    author: {
      /**
       * Returns true if the keystore has private keys for the given public key and key type.
       **/
      hasKey: AugmentedRpc<(publicKey: Bytes | string | Uint8Array, keyType: Text | string) => Observable<bool>>;
      /**
       * Returns true if the keystore has private keys for the given session public keys.
       **/
      hasSessionKeys: AugmentedRpc<(sessionKeys: Bytes | string | Uint8Array) => Observable<bool>>;
      /**
       * Insert a key into the keystore.
       **/
      insertKey: AugmentedRpc<(keyType: Text | string, suri: Text | string, publicKey: Bytes | string | Uint8Array) => Observable<Bytes>>;
      /**
       * Returns all pending extrinsics, potentially grouped by sender
       **/
      pendingExtrinsics: AugmentedRpc<() => Observable<Vec<Extrinsic>>>;
      /**
       * Remove given extrinsic from the pool and temporarily ban it to prevent reimporting
       **/
      removeExtrinsic: AugmentedRpc<(bytesOrHash: Vec<ExtrinsicOrHash> | (ExtrinsicOrHash | { Hash: any } | { Extrinsic: any } | string | Uint8Array)[]) => Observable<Vec<Hash>>>;
      /**
       * Generate new session keys and returns the corresponding public keys
       **/
      rotateKeys: AugmentedRpc<() => Observable<Bytes>>;
      /**
       * Submit and subscribe to watch an extrinsic until unsubscribed
       **/
      submitAndWatchExtrinsic: AugmentedRpc<(extrinsic: Extrinsic | IExtrinsic | string | Uint8Array) => Observable<ExtrinsicStatus>>;
      /**
       * Submit a fully formatted extrinsic for block inclusion
       **/
      submitExtrinsic: AugmentedRpc<(extrinsic: Extrinsic | IExtrinsic | string | Uint8Array) => Observable<Hash>>;
    };
    babe: {
      /**
       * Returns data about which slots (primary or secondary) can be claimed in the current epoch with the keys in the keystore
       **/
      epochAuthorship: AugmentedRpc<() => Observable<HashMap<AuthorityId, EpochAuthorship>>>;
    };
    beefy: {
      /**
       * Returns hash of the latest BEEFY finalized block as seen by this client.
       **/
      getFinalizedHead: AugmentedRpc<() => Observable<H256>>;
      /**
       * Returns the block most recently finalized by BEEFY, alongside its justification.
       **/
      subscribeJustifications: AugmentedRpc<() => Observable<BeefyVersionedFinalityProof>>;
    };
    chain: {
      /**
       * Get header and body of a relay chain block
       **/
      getBlock: AugmentedRpc<(hash?: BlockHash | string | Uint8Array) => Observable<SignedBlock>>;
      /**
       * Get the block hash for a specific block
       **/
      getBlockHash: AugmentedRpc<(blockNumber?: BlockNumber | AnyNumber | Uint8Array) => Observable<BlockHash>>;
      /**
       * Get hash of the last finalized block in the canon chain
       **/
      getFinalizedHead: AugmentedRpc<() => Observable<BlockHash>>;
      /**
       * Retrieves the header for a specific block
       **/
      getHeader: AugmentedRpc<(hash?: BlockHash | string | Uint8Array) => Observable<Header>>;
      /**
       * Retrieves the newest header via subscription
       **/
      subscribeAllHeads: AugmentedRpc<() => Observable<Header>>;
      /**
       * Retrieves the best finalized header via subscription
       **/
      subscribeFinalizedHeads: AugmentedRpc<() => Observable<Header>>;
      /**
       * Retrieves the best header via subscription
       **/
      subscribeNewHeads: AugmentedRpc<() => Observable<Header>>;
    };
    childstate: {
      /**
       * Returns the keys with prefix from a child storage, leave empty to get all the keys
       **/
      getKeys: AugmentedRpc<(childKey: PrefixedStorageKey | string | Uint8Array, prefix: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Observable<Vec<StorageKey>>>;
      /**
       * Returns the keys with prefix from a child storage with pagination support
       **/
      getKeysPaged: AugmentedRpc<(childKey: PrefixedStorageKey | string | Uint8Array, prefix: StorageKey | string | Uint8Array | any, count: u32 | AnyNumber | Uint8Array, startKey?: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Observable<Vec<StorageKey>>>;
      /**
       * Returns a child storage entry at a specific block state
       **/
      getStorage: AugmentedRpc<(childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Observable<Option<StorageData>>>;
      /**
       * Returns child storage entries for multiple keys at a specific block state
       **/
      getStorageEntries: AugmentedRpc<(childKey: PrefixedStorageKey | string | Uint8Array, keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: Hash | string | Uint8Array) => Observable<Vec<Option<StorageData>>>>;
      /**
       * Returns the hash of a child storage entry at a block state
       **/
      getStorageHash: AugmentedRpc<(childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Observable<Option<Hash>>>;
      /**
       * Returns the size of a child storage entry at a block state
       **/
      getStorageSize: AugmentedRpc<(childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Observable<Option<u64>>>;
    };
    contracts: {
      /**
       * @deprecated Use the runtime interface `api.call.contractsApi.call` instead
       * Executes a call to a contract
       **/
      call: AugmentedRpc<(callRequest: ContractCallRequest | { origin?: any; dest?: any; value?: any; gasLimit?: any; storageDepositLimit?: any; inputData?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<ContractExecResult>>;
      /**
       * @deprecated Use the runtime interface `api.call.contractsApi.getStorage` instead
       * Returns the value under a specified storage key in a contract
       **/
      getStorage: AugmentedRpc<(address: AccountId | string | Uint8Array, key: H256 | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * @deprecated Use the runtime interface `api.call.contractsApi.instantiate` instead
       * Instantiate a new contract
       **/
      instantiate: AugmentedRpc<(request: InstantiateRequestV1 | { origin?: any; value?: any; gasLimit?: any; code?: any; data?: any; salt?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<ContractInstantiateResult>>;
      /**
       * @deprecated Not available in newer versions of the contracts interfaces
       * Returns the projected time a given contract will be able to sustain paying its rent
       **/
      rentProjection: AugmentedRpc<(address: AccountId | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<Option<BlockNumber>>>;
      /**
       * @deprecated Use the runtime interface `api.call.contractsApi.uploadCode` instead
       * Upload new code without instantiating a contract from it
       **/
      uploadCode: AugmentedRpc<(uploadRequest: CodeUploadRequest | { origin?: any; code?: any; storageDepositLimit?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<CodeUploadResult>>;
    };
    dev: {
      /**
       * Reexecute the specified `block_hash` and gather statistics while doing so
       **/
      getBlockStats: AugmentedRpc<(at: Hash | string | Uint8Array) => Observable<Option<BlockStats>>>;
    };
    engine: {
      /**
       * Instructs the manual-seal authorship task to create a new block
       **/
      createBlock: AugmentedRpc<(createEmpty: bool | boolean | Uint8Array, finalize: bool | boolean | Uint8Array, parentHash?: BlockHash | string | Uint8Array) => Observable<CreatedBlock>>;
      /**
       * Instructs the manual-seal authorship task to finalize a block
       **/
      finalizeBlock: AugmentedRpc<(hash: BlockHash | string | Uint8Array, justification?: Justification) => Observable<bool>>;
    };
    eth: {
      /**
       * Returns accounts list.
       **/
      accounts: AugmentedRpc<() => Observable<Vec<H160>>>;
      /**
       * Returns the blockNumber
       **/
      blockNumber: AugmentedRpc<() => Observable<U256>>;
      /**
       * Call contract, returning the output data.
       **/
      call: AugmentedRpc<(request: EthCallRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Observable<Bytes>>;
      /**
       * Returns the chain ID used for transaction signing at the current best block. None is returned if not available.
       **/
      chainId: AugmentedRpc<() => Observable<U64>>;
      /**
       * Returns block author.
       **/
      coinbase: AugmentedRpc<() => Observable<H160>>;
      /**
       * Estimate gas needed for execution of given contract.
       **/
      estimateGas: AugmentedRpc<(request: EthCallRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Observable<U256>>;
      /**
       * Returns fee history for given block count & reward percentiles
       **/
      feeHistory: AugmentedRpc<(blockCount: U256 | AnyNumber | Uint8Array, newestBlock: BlockNumber | AnyNumber | Uint8Array, rewardPercentiles: Option<Vec<f64>> | null | Uint8Array | Vec<f64> | (f64)[]) => Observable<EthFeeHistory>>;
      /**
       * Returns current gas price.
       **/
      gasPrice: AugmentedRpc<() => Observable<U256>>;
      /**
       * Returns balance of the given account.
       **/
      getBalance: AugmentedRpc<(address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Observable<U256>>;
      /**
       * Returns block with given hash.
       **/
      getBlockByHash: AugmentedRpc<(hash: H256 | string | Uint8Array, full: bool | boolean | Uint8Array) => Observable<Option<EthRichBlock>>>;
      /**
       * Returns block with given number.
       **/
      getBlockByNumber: AugmentedRpc<(block: BlockNumber | AnyNumber | Uint8Array, full: bool | boolean | Uint8Array) => Observable<Option<EthRichBlock>>>;
      /**
       * Returns the number of transactions in a block with given hash.
       **/
      getBlockTransactionCountByHash: AugmentedRpc<(hash: H256 | string | Uint8Array) => Observable<U256>>;
      /**
       * Returns the number of transactions in a block with given block number.
       **/
      getBlockTransactionCountByNumber: AugmentedRpc<(block: BlockNumber | AnyNumber | Uint8Array) => Observable<U256>>;
      /**
       * Returns the code at given address at given time (block number).
       **/
      getCode: AugmentedRpc<(address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Observable<Bytes>>;
      /**
       * Returns filter changes since last poll.
       **/
      getFilterChanges: AugmentedRpc<(index: U256 | AnyNumber | Uint8Array) => Observable<EthFilterChanges>>;
      /**
       * Returns all logs matching given filter (in a range 'from' - 'to').
       **/
      getFilterLogs: AugmentedRpc<(index: U256 | AnyNumber | Uint8Array) => Observable<Vec<EthLog>>>;
      /**
       * Returns logs matching given filter object.
       **/
      getLogs: AugmentedRpc<(filter: EthFilter | { fromBlock?: any; toBlock?: any; blockHash?: any; address?: any; topics?: any } | string | Uint8Array) => Observable<Vec<EthLog>>>;
      /**
       * Returns proof for account and storage.
       **/
      getProof: AugmentedRpc<(address: H160 | string | Uint8Array, storageKeys: Vec<H256> | (H256 | string | Uint8Array)[], number: BlockNumber | AnyNumber | Uint8Array) => Observable<EthAccount>>;
      /**
       * Returns content of the storage at given address.
       **/
      getStorageAt: AugmentedRpc<(address: H160 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Observable<H256>>;
      /**
       * Returns transaction at given block hash and index.
       **/
      getTransactionByBlockHashAndIndex: AugmentedRpc<(hash: H256 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Observable<EthTransaction>>;
      /**
       * Returns transaction by given block number and index.
       **/
      getTransactionByBlockNumberAndIndex: AugmentedRpc<(number: BlockNumber | AnyNumber | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Observable<EthTransaction>>;
      /**
       * Get transaction by its hash.
       **/
      getTransactionByHash: AugmentedRpc<(hash: H256 | string | Uint8Array) => Observable<EthTransaction>>;
      /**
       * Returns the number of transactions sent from given address at given time (block number).
       **/
      getTransactionCount: AugmentedRpc<(address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Observable<U256>>;
      /**
       * Returns transaction receipt by transaction hash.
       **/
      getTransactionReceipt: AugmentedRpc<(hash: H256 | string | Uint8Array) => Observable<EthReceipt>>;
      /**
       * Returns an uncles at given block and index.
       **/
      getUncleByBlockHashAndIndex: AugmentedRpc<(hash: H256 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Observable<EthRichBlock>>;
      /**
       * Returns an uncles at given block and index.
       **/
      getUncleByBlockNumberAndIndex: AugmentedRpc<(number: BlockNumber | AnyNumber | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Observable<EthRichBlock>>;
      /**
       * Returns the number of uncles in a block with given hash.
       **/
      getUncleCountByBlockHash: AugmentedRpc<(hash: H256 | string | Uint8Array) => Observable<U256>>;
      /**
       * Returns the number of uncles in a block with given block number.
       **/
      getUncleCountByBlockNumber: AugmentedRpc<(number: BlockNumber | AnyNumber | Uint8Array) => Observable<U256>>;
      /**
       * Returns the hash of the current block, the seedHash, and the boundary condition to be met.
       **/
      getWork: AugmentedRpc<() => Observable<EthWork>>;
      /**
       * Returns the number of hashes per second that the node is mining with.
       **/
      hashrate: AugmentedRpc<() => Observable<U256>>;
      /**
       * Returns max priority fee per gas
       **/
      maxPriorityFeePerGas: AugmentedRpc<() => Observable<U256>>;
      /**
       * Returns true if client is actively mining new blocks.
       **/
      mining: AugmentedRpc<() => Observable<bool>>;
      /**
       * Returns id of new block filter.
       **/
      newBlockFilter: AugmentedRpc<() => Observable<U256>>;
      /**
       * Returns id of new filter.
       **/
      newFilter: AugmentedRpc<(filter: EthFilter | { fromBlock?: any; toBlock?: any; blockHash?: any; address?: any; topics?: any } | string | Uint8Array) => Observable<U256>>;
      /**
       * Returns id of new block filter.
       **/
      newPendingTransactionFilter: AugmentedRpc<() => Observable<U256>>;
      /**
       * Returns protocol version encoded as a string (quotes are necessary).
       **/
      protocolVersion: AugmentedRpc<() => Observable<u64>>;
      /**
       * Sends signed transaction, returning its hash.
       **/
      sendRawTransaction: AugmentedRpc<(bytes: Bytes | string | Uint8Array) => Observable<H256>>;
      /**
       * Sends transaction; will block waiting for signer to return the transaction hash
       **/
      sendTransaction: AugmentedRpc<(tx: EthTransactionRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array) => Observable<H256>>;
      /**
       * Used for submitting mining hashrate.
       **/
      submitHashrate: AugmentedRpc<(index: U256 | AnyNumber | Uint8Array, hash: H256 | string | Uint8Array) => Observable<bool>>;
      /**
       * Used for submitting a proof-of-work solution.
       **/
      submitWork: AugmentedRpc<(nonce: H64 | string | Uint8Array, headerHash: H256 | string | Uint8Array, mixDigest: H256 | string | Uint8Array) => Observable<bool>>;
      /**
       * Subscribe to Eth subscription.
       **/
      subscribe: AugmentedRpc<(kind: EthSubKind | 'newHeads' | 'logs' | 'newPendingTransactions' | 'syncing' | number | Uint8Array, params?: EthSubParams | { None: any } | { Logs: any } | string | Uint8Array) => Observable<Null>>;
      /**
       * Returns an object with data about the sync status or false.
       **/
      syncing: AugmentedRpc<() => Observable<EthSyncStatus>>;
      /**
       * Uninstalls filter.
       **/
      uninstallFilter: AugmentedRpc<(index: U256 | AnyNumber | Uint8Array) => Observable<bool>>;
    };
    grandpa: {
      /**
       * Prove finality for the given block number, returning the Justification for the last block in the set.
       **/
      proveFinality: AugmentedRpc<(blockNumber: BlockNumber | AnyNumber | Uint8Array) => Observable<Option<EncodedFinalityProofs>>>;
      /**
       * Returns the state of the current best round state as well as the ongoing background rounds
       **/
      roundState: AugmentedRpc<() => Observable<ReportedRoundStates>>;
      /**
       * Subscribes to grandpa justifications
       **/
      subscribeJustifications: AugmentedRpc<() => Observable<JustificationNotification>>;
    };
    mmr: {
      /**
       * Generate MMR proof for the given block numbers.
       **/
      generateProof: AugmentedRpc<(blockNumbers: Vec<u64> | (u64 | AnyNumber | Uint8Array)[], bestKnownBlockNumber?: u64 | AnyNumber | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<MmrLeafBatchProof>>;
      /**
       * Get the MMR root hash for the current best block.
       **/
      root: AugmentedRpc<(at?: BlockHash | string | Uint8Array) => Observable<MmrHash>>;
      /**
       * Verify an MMR proof
       **/
      verifyProof: AugmentedRpc<(proof: MmrLeafBatchProof | { blockHash?: any; leaves?: any; proof?: any } | string | Uint8Array) => Observable<bool>>;
      /**
       * Verify an MMR proof statelessly given an mmr_root
       **/
      verifyProofStateless: AugmentedRpc<(root: MmrHash | string | Uint8Array, proof: MmrLeafBatchProof | { blockHash?: any; leaves?: any; proof?: any } | string | Uint8Array) => Observable<bool>>;
    };
    net: {
      /**
       * Returns true if client is actively listening for network connections. Otherwise false.
       **/
      listening: AugmentedRpc<() => Observable<bool>>;
      /**
       * Returns number of peers connected to node.
       **/
      peerCount: AugmentedRpc<() => Observable<Text>>;
      /**
       * Returns protocol version.
       **/
      version: AugmentedRpc<() => Observable<Text>>;
    };
    offchain: {
      /**
       * Get offchain local storage under given key and prefix
       **/
      localStorageGet: AugmentedRpc<(kind: StorageKind | 'PERSISTENT' | 'LOCAL' | number | Uint8Array, key: Bytes | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * Set offchain local storage under given key and prefix
       **/
      localStorageSet: AugmentedRpc<(kind: StorageKind | 'PERSISTENT' | 'LOCAL' | number | Uint8Array, key: Bytes | string | Uint8Array, value: Bytes | string | Uint8Array) => Observable<Null>>;
    };
    payment: {
      /**
       * @deprecated Use `api.call.transactionPaymentApi.queryFeeDetails` instead
       * Query the detailed fee of a given encoded extrinsic
       **/
      queryFeeDetails: AugmentedRpc<(extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<FeeDetails>>;
      /**
       * @deprecated Use `api.call.transactionPaymentApi.queryInfo` instead
       * Retrieves the fee information for an encoded extrinsic
       **/
      queryInfo: AugmentedRpc<(extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<RuntimeDispatchInfoV1>>;
    };
    rpc: {
      /**
       * Retrieves the list of RPC methods that are exposed by the node
       **/
      methods: AugmentedRpc<() => Observable<RpcMethods>>;
    };
    state: {
      /**
       * Perform a call to a builtin on the chain
       **/
      call: AugmentedRpc<(method: Text | string, data: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<Bytes>>;
      /**
       * Retrieves the keys with prefix of a specific child storage
       **/
      getChildKeys: AugmentedRpc<(childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<Vec<StorageKey>>>;
      /**
       * Returns proof of storage for child key entries at a specific block state.
       **/
      getChildReadProof: AugmentedRpc<(childStorageKey: PrefixedStorageKey | string | Uint8Array, keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: BlockHash | string | Uint8Array) => Observable<ReadProof>>;
      /**
       * Retrieves the child storage for a key
       **/
      getChildStorage: AugmentedRpc<(childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<StorageData>>;
      /**
       * Retrieves the child storage hash
       **/
      getChildStorageHash: AugmentedRpc<(childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<Hash>>;
      /**
       * Retrieves the child storage size
       **/
      getChildStorageSize: AugmentedRpc<(childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<u64>>;
      /**
       * @deprecated Use `api.rpc.state.getKeysPaged` to retrieve keys
       * Retrieves the keys with a certain prefix
       **/
      getKeys: AugmentedRpc<(key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<Vec<StorageKey>>>;
      /**
       * Returns the keys with prefix with pagination support.
       **/
      getKeysPaged: AugmentedRpc<(key: StorageKey | string | Uint8Array | any, count: u32 | AnyNumber | Uint8Array, startKey?: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<Vec<StorageKey>>>;
      /**
       * Returns the runtime metadata
       **/
      getMetadata: AugmentedRpc<(at?: BlockHash | string | Uint8Array) => Observable<Metadata>>;
      /**
       * @deprecated Use `api.rpc.state.getKeysPaged` to retrieve keys
       * Returns the keys with prefix, leave empty to get all the keys (deprecated: Use getKeysPaged)
       **/
      getPairs: AugmentedRpc<(prefix: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<Vec<KeyValue>>>;
      /**
       * Returns proof of storage entries at a specific block state
       **/
      getReadProof: AugmentedRpc<(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: BlockHash | string | Uint8Array) => Observable<ReadProof>>;
      /**
       * Get the runtime version
       **/
      getRuntimeVersion: AugmentedRpc<(at?: BlockHash | string | Uint8Array) => Observable<RuntimeVersion>>;
      /**
       * Retrieves the storage for a key
       **/
      getStorage: AugmentedRpc<<T = Codec>(key: StorageKey | string | Uint8Array | any, block?: Hash | Uint8Array | string) => Observable<T>>;
      /**
       * Retrieves the storage hash
       **/
      getStorageHash: AugmentedRpc<(key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<Hash>>;
      /**
       * Retrieves the storage size
       **/
      getStorageSize: AugmentedRpc<(key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Observable<u64>>;
      /**
       * Query historical storage entries (by key) starting from a start block
       **/
      queryStorage: AugmentedRpc<<T = Codec[]>(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], fromBlock?: Hash | Uint8Array | string, toBlock?: Hash | Uint8Array | string) => Observable<[Hash, T][]>>;
      /**
       * Query storage entries (by key) starting at block hash given as the second parameter
       **/
      queryStorageAt: AugmentedRpc<<T = Codec[]>(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: Hash | Uint8Array | string) => Observable<T>>;
      /**
       * Retrieves the runtime version via subscription
       **/
      subscribeRuntimeVersion: AugmentedRpc<() => Observable<RuntimeVersion>>;
      /**
       * Subscribes to storage changes for the provided keys
       **/
      subscribeStorage: AugmentedRpc<<T = Codec[]>(keys?: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[]) => Observable<T>>;
      /**
       * Provides a way to trace the re-execution of a single block
       **/
      traceBlock: AugmentedRpc<(block: Hash | string | Uint8Array, targets: Option<Text> | null | Uint8Array | Text | string, storageKeys: Option<Text> | null | Uint8Array | Text | string, methods: Option<Text> | null | Uint8Array | Text | string) => Observable<TraceBlockResponse>>;
      /**
       * Check current migration state
       **/
      trieMigrationStatus: AugmentedRpc<(at?: BlockHash | string | Uint8Array) => Observable<MigrationStatusResult>>;
    };
    syncstate: {
      /**
       * Returns the json-serialized chainspec running the node, with a sync state.
       **/
      genSyncSpec: AugmentedRpc<(raw: bool | boolean | Uint8Array) => Observable<Json>>;
    };
    system: {
      /**
       * Retrieves the next accountIndex as available on the node
       **/
      accountNextIndex: AugmentedRpc<(accountId: AccountId | string | Uint8Array) => Observable<Index>>;
      /**
       * Adds the supplied directives to the current log filter
       **/
      addLogFilter: AugmentedRpc<(directives: Text | string) => Observable<Null>>;
      /**
       * Adds a reserved peer
       **/
      addReservedPeer: AugmentedRpc<(peer: Text | string) => Observable<Text>>;
      /**
       * Retrieves the chain
       **/
      chain: AugmentedRpc<() => Observable<Text>>;
      /**
       * Retrieves the chain type
       **/
      chainType: AugmentedRpc<() => Observable<ChainType>>;
      /**
       * Dry run an extrinsic at a given block
       **/
      dryRun: AugmentedRpc<(extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Observable<ApplyExtrinsicResult>>;
      /**
       * Return health status of the node
       **/
      health: AugmentedRpc<() => Observable<Health>>;
      /**
       * The addresses include a trailing /p2p/ with the local PeerId, and are thus suitable to be passed to addReservedPeer or as a bootnode address for example
       **/
      localListenAddresses: AugmentedRpc<() => Observable<Vec<Text>>>;
      /**
       * Returns the base58-encoded PeerId of the node
       **/
      localPeerId: AugmentedRpc<() => Observable<Text>>;
      /**
       * Retrieves the node name
       **/
      name: AugmentedRpc<() => Observable<Text>>;
      /**
       * Returns current state of the network
       **/
      networkState: AugmentedRpc<() => Observable<NetworkState>>;
      /**
       * Returns the roles the node is running as
       **/
      nodeRoles: AugmentedRpc<() => Observable<Vec<NodeRole>>>;
      /**
       * Returns the currently connected peers
       **/
      peers: AugmentedRpc<() => Observable<Vec<PeerInfo>>>;
      /**
       * Get a custom set of properties as a JSON object, defined in the chain spec
       **/
      properties: AugmentedRpc<() => Observable<ChainProperties>>;
      /**
       * Remove a reserved peer
       **/
      removeReservedPeer: AugmentedRpc<(peerId: Text | string) => Observable<Text>>;
      /**
       * Returns the list of reserved peers
       **/
      reservedPeers: AugmentedRpc<() => Observable<Vec<Text>>>;
      /**
       * Resets the log filter to Substrate defaults
       **/
      resetLogFilter: AugmentedRpc<() => Observable<Null>>;
      /**
       * Returns the state of the syncing of the node
       **/
      syncState: AugmentedRpc<() => Observable<SyncState>>;
      /**
       * Retrieves the version of the node
       **/
      version: AugmentedRpc<() => Observable<Text>>;
    };
    web3: {
      /**
       * Returns current client version.
       **/
      clientVersion: AugmentedRpc<() => Observable<Text>>;
      /**
       * Returns sha3 of the given data
       **/
      sha3: AugmentedRpc<(data: Bytes | string | Uint8Array) => Observable<H256>>;
    };
  } // RpcInterface
} // declare module

// -----------------
// Added types
// -----------------

/**
 * This interface is used to generate the rpc methods that is compatible with web3.js types.
 * @remarks 
 * This interface in not inside a module augmentation because it causes confusion to TypeScript compiler, when used inside another project, tricking it to see every property as `any`.
 */
export interface PolkadotSimpleRpcInterface {
  author: {
    /**
     * Returns true if the keystore has private keys for the given public key and key type.
     **/
    hasKey: (publicKey: Bytes | string | Uint8Array, keyType: Text | string) => Promise<bool>;
    /**
     * Returns true if the keystore has private keys for the given session public keys.
     **/
    hasSessionKeys: (sessionKeys: Bytes | string | Uint8Array) => Promise<bool>;
    /**
     * Insert a key into the keystore.
     **/
    insertKey: (keyType: Text | string, suri: Text | string, publicKey: Bytes | string | Uint8Array) => Promise<Bytes>;
    /**
     * Returns all pending extrinsics, potentially grouped by sender
     **/
    pendingExtrinsics: () => Promise<Vec<Extrinsic>>;
    /**
     * Remove given extrinsic from the pool and temporarily ban it to prevent reimporting
     **/
    removeExtrinsic: (bytesOrHash: Vec<ExtrinsicOrHash> | (ExtrinsicOrHash | { Hash: any } | { Extrinsic: any } | string | Uint8Array)[]) => Promise<Vec<Hash>>;
    /**
     * Generate new session keys and returns the corresponding public keys
     **/
    rotateKeys: () => Promise<Bytes>;
    /**
     * Submit and subscribe to watch an extrinsic until unsubscribed
     **/
    submitAndWatchExtrinsic: (extrinsic: Extrinsic | IExtrinsic | string | Uint8Array) => Promise<ExtrinsicStatus>;
    /**
     * Submit a fully formatted extrinsic for block inclusion
     **/
    submitExtrinsic: (extrinsic: Extrinsic | IExtrinsic | string | Uint8Array) => Promise<Hash>;
  };
  babe: {
    /**
     * Returns data about which slots (primary or secondary) can be claimed in the current epoch with the keys in the keystore
     **/
    epochAuthorship: () => Promise<HashMap<AuthorityId, EpochAuthorship>>;
  };
  beefy: {
    /**
     * Returns hash of the latest BEEFY finalized block as seen by this client.
     **/
    getFinalizedHead: () => Promise<H256>;
    /**
     * Returns the block most recently finalized by BEEFY, alongside its justification.
     **/
    subscribeJustifications: () => Promise<BeefyVersionedFinalityProof>;
  };
  chain: {
    /**
     * Get header and body of a relay chain block
     **/
    getBlock: (hash?: BlockHash | string | Uint8Array) => Promise<SignedBlock>;
    /**
     * Get the block hash for a specific block
     **/
    getBlockHash: (blockNumber?: BlockNumber | AnyNumber | Uint8Array) => Promise<BlockHash>;
    /**
     * Get hash of the last finalized block in the canon chain
     **/
    getFinalizedHead: () => Promise<BlockHash>;
    /**
     * Retrieves the header for a specific block
     **/
    getHeader: (hash?: BlockHash | string | Uint8Array) => Promise<Header>;
    /**
     * Retrieves the newest header via subscription
     **/
    subscribeAllHeads: () => Promise<Header>;
    /**
     * Retrieves the best finalized header via subscription
     **/
    subscribeFinalizedHeads: () => Promise<Header>;
    /**
     * Retrieves the best header via subscription
     **/
    subscribeNewHeads: () => Promise<Header>;
  };
  childstate: {
    /**
     * Returns the keys with prefix from a child storage, leave empty to get all the keys
     **/
    getKeys: (childKey: PrefixedStorageKey | string | Uint8Array, prefix: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Promise<Vec<StorageKey>>;
    /**
     * Returns the keys with prefix from a child storage with pagination support
     **/
    getKeysPaged: (childKey: PrefixedStorageKey | string | Uint8Array, prefix: StorageKey | string | Uint8Array | any, count: u32 | AnyNumber | Uint8Array, startKey?: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Promise<Vec<StorageKey>>;
    /**
     * Returns a child storage entry at a specific block state
     **/
    getStorage: (childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Promise<Option<StorageData>>;
    /**
     * Returns child storage entries for multiple keys at a specific block state
     **/
    getStorageEntries: (childKey: PrefixedStorageKey | string | Uint8Array, keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: Hash | string | Uint8Array) => Promise<Vec<Option<StorageData>>>;
    /**
     * Returns the hash of a child storage entry at a block state
     **/
    getStorageHash: (childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Promise<Option<Hash>>;
    /**
     * Returns the size of a child storage entry at a block state
     **/
    getStorageSize: (childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array) => Promise<Option<u64>>;
  };
  contracts: {
    /**
     * @deprecated Use the runtime interface `api.call.contractsApi.call` instead
     * Executes a call to a contract
     **/
    call: (callRequest: ContractCallRequest | { origin?: any; dest?: any; value?: any; gasLimit?: any; storageDepositLimit?: any; inputData?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<ContractExecResult>;
    /**
     * @deprecated Use the runtime interface `api.call.contractsApi.getStorage` instead
     * Returns the value under a specified storage key in a contract
     **/
    getStorage: (address: AccountId | string | Uint8Array, key: H256 | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<Option<Bytes>>;
    /**
     * @deprecated Use the runtime interface `api.call.contractsApi.instantiate` instead
     * Instantiate a new contract
     **/
    instantiate: (request: InstantiateRequestV1 | { origin?: any; value?: any; gasLimit?: any; code?: any; data?: any; salt?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<ContractInstantiateResult>;
    /**
     * @deprecated Not available in newer versions of the contracts interfaces
     * Returns the projected time a given contract will be able to sustain paying its rent
     **/
    rentProjection: (address: AccountId | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<Option<BlockNumber>>;
    /**
     * @deprecated Use the runtime interface `api.call.contractsApi.uploadCode` instead
     * Upload new code without instantiating a contract from it
     **/
    uploadCode: (uploadRequest: CodeUploadRequest | { origin?: any; code?: any; storageDepositLimit?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<CodeUploadResult>;
  };
  dev: {
    /**
     * Reexecute the specified `block_hash` and gather statistics while doing so
     **/
    getBlockStats: (at: Hash | string | Uint8Array) => Promise<Option<BlockStats>>;
  };
  engine: {
    /**
     * Instructs the manual-seal authorship task to create a new block
     **/
    createBlock: (createEmpty: bool | boolean | Uint8Array, finalize: bool | boolean | Uint8Array, parentHash?: BlockHash | string | Uint8Array) => Promise<CreatedBlock>;
    /**
     * Instructs the manual-seal authorship task to finalize a block
     **/
    finalizeBlock: (hash: BlockHash | string | Uint8Array, justification?: Justification) => Promise<bool>;
  };
  eth: {
    /**
     * Returns accounts list.
     **/
    accounts: () => Promise<Vec<H160>>;
    /**
     * Returns the blockNumber
     **/
    blockNumber: () => Promise<U256>;
    /**
     * Call contract, returning the output data.
     **/
    call: (request: EthCallRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Promise<Bytes>;
    /**
     * Returns the chain ID used for transaction signing at the current best block. None is returned if not available.
     **/
    chainId: () => Promise<U64>;
    /**
     * Returns block author.
     **/
    coinbase: () => Promise<H160>;
    /**
     * Estimate gas needed for execution of given contract.
     **/
    estimateGas: (request: EthCallRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Promise<U256>;
    /**
     * Returns fee history for given block count & reward percentiles
     **/
    feeHistory: (blockCount: U256 | AnyNumber | Uint8Array, newestBlock: BlockNumber | AnyNumber | Uint8Array, rewardPercentiles: Option<Vec<f64>> | null | Uint8Array | Vec<f64> | (f64)[]) => Promise<EthFeeHistory>;
    /**
     * Returns current gas price.
     **/
    gasPrice: () => Promise<U256>;
    /**
     * Returns balance of the given account.
     **/
    getBalance: (address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Promise<U256>;
    /**
     * Returns block with given hash.
     **/
    getBlockByHash: (hash: H256 | string | Uint8Array, full: bool | boolean | Uint8Array) => Promise<Option<EthRichBlock>>;
    /**
     * Returns block with given number.
     **/
    getBlockByNumber: (block: BlockNumber | AnyNumber | Uint8Array, full: bool | boolean | Uint8Array) => Promise<Option<EthRichBlock>>;
    /**
     * Returns the number of transactions in a block with given hash.
     **/
    getBlockTransactionCountByHash: (hash: H256 | string | Uint8Array) => Promise<U256>;
    /**
     * Returns the number of transactions in a block with given block number.
     **/
    getBlockTransactionCountByNumber: (block: BlockNumber | AnyNumber | Uint8Array) => Promise<U256>;
    /**
     * Returns the code at given address at given time (block number).
     **/
    getCode: (address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Promise<Bytes>;
    /**
     * Returns filter changes since last poll.
     **/
    getFilterChanges: (index: U256 | AnyNumber | Uint8Array) => Promise<EthFilterChanges>;
    /**
     * Returns all logs matching given filter (in a range 'from' - 'to').
     **/
    getFilterLogs: (index: U256 | AnyNumber | Uint8Array) => Promise<Vec<EthLog>>;
    /**
     * Returns logs matching given filter object.
     **/
    getLogs: (filter: EthFilter | { fromBlock?: any; toBlock?: any; blockHash?: any; address?: any; topics?: any } | string | Uint8Array) => Promise<Vec<EthLog>>;
    /**
     * Returns proof for account and storage.
     **/
    getProof: (address: H160 | string | Uint8Array, storageKeys: Vec<H256> | (H256 | string | Uint8Array)[], number: BlockNumber | AnyNumber | Uint8Array) => Promise<EthAccount>;
    /**
     * Returns content of the storage at given address.
     **/
    getStorageAt: (address: H160 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Promise<H256>;
    /**
     * Returns transaction at given block hash and index.
     **/
    getTransactionByBlockHashAndIndex: (hash: H256 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Promise<EthTransaction>;
    /**
     * Returns transaction by given block number and index.
     **/
    getTransactionByBlockNumberAndIndex: (number: BlockNumber | AnyNumber | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Promise<EthTransaction>;
    /**
     * Get transaction by its hash.
     **/
    getTransactionByHash: (hash: H256 | string | Uint8Array) => Promise<EthTransaction>;
    /**
     * Returns the number of transactions sent from given address at given time (block number).
     **/
    getTransactionCount: (address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array) => Promise<U256>;
    /**
     * Returns transaction receipt by transaction hash.
     **/
    getTransactionReceipt: (hash: H256 | string | Uint8Array) => Promise<EthReceipt>;
    /**
     * Returns an uncles at given block and index.
     **/
    getUncleByBlockHashAndIndex: (hash: H256 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Promise<EthRichBlock>;
    /**
     * Returns an uncles at given block and index.
     **/
    getUncleByBlockNumberAndIndex: (number: BlockNumber | AnyNumber | Uint8Array, index: U256 | AnyNumber | Uint8Array) => Promise<EthRichBlock>;
    /**
     * Returns the number of uncles in a block with given hash.
     **/
    getUncleCountByBlockHash: (hash: H256 | string | Uint8Array) => Promise<U256>;
    /**
     * Returns the number of uncles in a block with given block number.
     **/
    getUncleCountByBlockNumber: (number: BlockNumber | AnyNumber | Uint8Array) => Promise<U256>;
    /**
     * Returns the hash of the current block, the seedHash, and the boundary condition to be met.
     **/
    getWork: () => Promise<EthWork>;
    /**
     * Returns the number of hashes per second that the node is mining with.
     **/
    hashrate: () => Promise<U256>;
    /**
     * Returns max priority fee per gas
     **/
    maxPriorityFeePerGas: () => Promise<U256>;
    /**
     * Returns true if client is actively mining new blocks.
     **/
    mining: () => Promise<bool>;
    /**
     * Returns id of new block filter.
     **/
    newBlockFilter: () => Promise<U256>;
    /**
     * Returns id of new filter.
     **/
    newFilter: (filter: EthFilter | { fromBlock?: any; toBlock?: any; blockHash?: any; address?: any; topics?: any } | string | Uint8Array) => Promise<U256>;
    /**
     * Returns id of new block filter.
     **/
    newPendingTransactionFilter: () => Promise<U256>;
    /**
     * Returns protocol version encoded as a string (quotes are necessary).
     **/
    protocolVersion: () => Promise<u64>;
    /**
     * Sends signed transaction, returning its hash.
     **/
    sendRawTransaction: (bytes: Bytes | string | Uint8Array) => Promise<H256>;
    /**
     * Sends transaction; will block waiting for signer to return the transaction hash
     **/
    sendTransaction: (tx: EthTransactionRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array) => Promise<H256>;
    /**
     * Used for submitting mining hashrate.
     **/
    submitHashrate: (index: U256 | AnyNumber | Uint8Array, hash: H256 | string | Uint8Array) => Promise<bool>;
    /**
     * Used for submitting a proof-of-work solution.
     **/
    submitWork: (nonce: H64 | string | Uint8Array, headerHash: H256 | string | Uint8Array, mixDigest: H256 | string | Uint8Array) => Promise<bool>;
    /**
     * Subscribe to Eth subscription.
     **/
    subscribe: (kind: EthSubKind | 'newHeads' | 'logs' | 'newPendingTransactions' | 'syncing' | number | Uint8Array, params?: EthSubParams | { None: any } | { Logs: any } | string | Uint8Array) => Promise<Null>;
    /**
     * Returns an object with data about the sync status or false.
     **/
    syncing: () => Promise<EthSyncStatus>;
    /**
     * Uninstalls filter.
     **/
    uninstallFilter: (index: U256 | AnyNumber | Uint8Array) => Promise<bool>;
  };
  grandpa: {
    /**
     * Prove finality for the given block number, returning the Justification for the last block in the set.
     **/
    proveFinality: (blockNumber: BlockNumber | AnyNumber | Uint8Array) => Promise<Option<EncodedFinalityProofs>>;
    /**
     * Returns the state of the current best round state as well as the ongoing background rounds
     **/
    roundState: () => Promise<ReportedRoundStates>;
    /**
     * Subscribes to grandpa justifications
     **/
    subscribeJustifications: () => Promise<JustificationNotification>;
  };
  mmr: {
    /**
     * Generate MMR proof for the given block numbers.
     **/
    generateProof: (blockNumbers: Vec<u64> | (u64 | AnyNumber | Uint8Array)[], bestKnownBlockNumber?: u64 | AnyNumber | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<MmrLeafBatchProof>;
    /**
     * Get the MMR root hash for the current best block.
     **/
    root: (at?: BlockHash | string | Uint8Array) => Promise<MmrHash>;
    /**
     * Verify an MMR proof
     **/
    verifyProof: (proof: MmrLeafBatchProof | { blockHash?: any; leaves?: any; proof?: any } | string | Uint8Array) => Promise<bool>;
    /**
     * Verify an MMR proof statelessly given an mmr_root
     **/
    verifyProofStateless: (root: MmrHash | string | Uint8Array, proof: MmrLeafBatchProof | { blockHash?: any; leaves?: any; proof?: any } | string | Uint8Array) => Promise<bool>;
  };
  net: {
    /**
     * Returns true if client is actively listening for network connections. Otherwise false.
     **/
    listening: () => Promise<bool>;
    /**
     * Returns number of peers connected to node.
     **/
    peerCount: () => Promise<Text>;
    /**
     * Returns protocol version.
     **/
    version: () => Promise<Text>;
  };
  offchain: {
    /**
     * Get offchain local storage under given key and prefix
     **/
    localStorageGet: (kind: StorageKind | 'PERSISTENT' | 'LOCAL' | number | Uint8Array, key: Bytes | string | Uint8Array) => Promise<Option<Bytes>>;
    /**
     * Set offchain local storage under given key and prefix
     **/
    localStorageSet: (kind: StorageKind | 'PERSISTENT' | 'LOCAL' | number | Uint8Array, key: Bytes | string | Uint8Array, value: Bytes | string | Uint8Array) => Promise<Null>;
  };
  payment: {
    /**
     * @deprecated Use `api.call.transactionPaymentApi.queryFeeDetails` instead
     * Query the detailed fee of a given encoded extrinsic
     **/
    queryFeeDetails: (extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<FeeDetails>;
    /**
     * @deprecated Use `api.call.transactionPaymentApi.queryInfo` instead
     * Retrieves the fee information for an encoded extrinsic
     **/
    queryInfo: (extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<RuntimeDispatchInfoV1>;
  };
  rpc: {
    /**
     * Retrieves the list of RPC methods that are exposed by the node
     **/
    methods: () => Promise<RpcMethods>;
  };
  state: {
    /**
     * Perform a call to a builtin on the chain
     **/
    call: (method: Text | string, data: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<Bytes>;
    /**
     * Retrieves the keys with prefix of a specific child storage
     **/
    getChildKeys: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<Vec<StorageKey>>;
    /**
     * Returns proof of storage for child key entries at a specific block state.
     **/
    getChildReadProof: (childStorageKey: PrefixedStorageKey | string | Uint8Array, keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: BlockHash | string | Uint8Array) => Promise<ReadProof>;
    /**
     * Retrieves the child storage for a key
     **/
    getChildStorage: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<StorageData>;
    /**
     * Retrieves the child storage hash
     **/
    getChildStorageHash: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<Hash>;
    /**
     * Retrieves the child storage size
     **/
    getChildStorageSize: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<u64>;
    /**
     * @deprecated Use `api.rpc.state.getKeysPaged` to retrieve keys
     * Retrieves the keys with a certain prefix
     **/
    getKeys: (key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<Vec<StorageKey>>;
    /**
     * Returns the keys with prefix with pagination support.
     **/
    getKeysPaged: (key: StorageKey | string | Uint8Array | any, count: u32 | AnyNumber | Uint8Array, startKey?: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<Vec<StorageKey>>;
    /**
     * Returns the runtime metadata
     **/
    getMetadata: (at?: BlockHash | string | Uint8Array) => Promise<Metadata>;
    /**
     * @deprecated Use `api.rpc.state.getKeysPaged` to retrieve keys
     * Returns the keys with prefix, leave empty to get all the keys (deprecated: Use getKeysPaged)
     **/
    getPairs: (prefix: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<Vec<KeyValue>>;
    /**
     * Returns proof of storage entries at a specific block state
     **/
    getReadProof: (keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: BlockHash | string | Uint8Array) => Promise<ReadProof>;
    /**
     * Get the runtime version
     **/
    getRuntimeVersion: (at?: BlockHash | string | Uint8Array) => Promise<RuntimeVersion>;
    /**
     * Retrieves the storage for a key
     **/
    getStorage: <T = Codec>(key: StorageKey | string | Uint8Array | any, block?: Hash | Uint8Array | string) => Promise<T>;
    /**
     * Retrieves the storage hash
     **/
    getStorageHash: (key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<Hash>;
    /**
     * Retrieves the storage size
     **/
    getStorageSize: (key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array) => Promise<u64>;
    /**
     * Query historical storage entries (by key) starting from a start block
     **/
    queryStorage: <T = Codec[]>(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], fromBlock?: Hash | Uint8Array | string, toBlock?: Hash | Uint8Array | string) => Promise<[Hash, T][]>;
    /**
     * Query storage entries (by key) starting at block hash given as the second parameter
     **/
    queryStorageAt: <T = Codec[]>(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: Hash | Uint8Array | string) => Promise<T>;
    /**
     * Retrieves the runtime version via subscription
     **/
    subscribeRuntimeVersion: () => Promise<RuntimeVersion>;
    /**
     * Subscribes to storage changes for the provided keys
     **/
    subscribeStorage: <T = Codec[]>(keys?: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[]) => Promise<T>;
    /**
     * Provides a way to trace the re-execution of a single block
     **/
    traceBlock: (block: Hash | string | Uint8Array, targets: Option<Text> | null | Uint8Array | Text | string, storageKeys: Option<Text> | null | Uint8Array | Text | string, methods: Option<Text> | null | Uint8Array | Text | string) => Promise<TraceBlockResponse>;
    /**
     * Check current migration state
     **/
    trieMigrationStatus: (at?: BlockHash | string | Uint8Array) => Promise<MigrationStatusResult>;
  };
  syncstate: {
    /**
     * Returns the json-serialized chainspec running the node, with a sync state.
     **/
    genSyncSpec: (raw: bool | boolean | Uint8Array) => Promise<Json>;
  };
  system: {
    /**
     * Retrieves the next accountIndex as available on the node
     **/
    accountNextIndex: (accountId: AccountId | string | Uint8Array) => Promise<Index>;
    /**
     * Adds the supplied directives to the current log filter
     **/
    addLogFilter: (directives: Text | string) => Promise<Null>;
    /**
     * Adds a reserved peer
     **/
    addReservedPeer: (peer: Text | string) => Promise<Text>;
    /**
     * Retrieves the chain
     **/
    chain: () => Promise<Text>;
    /**
     * Retrieves the chain type
     **/
    chainType: () => Promise<ChainType>;
    /**
     * Dry run an extrinsic at a given block
     **/
    dryRun: (extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array) => Promise<ApplyExtrinsicResult>;
    /**
     * Return health status of the node
     **/
    health: () => Promise<Health>;
    /**
     * The addresses include a trailing /p2p/ with the local PeerId, and are thus suitable to be passed to addReservedPeer or as a bootnode address for example
     **/
    localListenAddresses: () => Promise<Vec<Text>>;
    /**
     * Returns the base58-encoded PeerId of the node
     **/
    localPeerId: () => Promise<Text>;
    /**
     * Retrieves the node name
     **/
    name: () => Promise<Text>;
    /**
     * Returns current state of the network
     **/
    networkState: () => Promise<NetworkState>;
    /**
     * Returns the roles the node is running as
     **/
    nodeRoles: () => Promise<Vec<NodeRole>>;
    /**
     * Returns the currently connected peers
     **/
    peers: () => Promise<Vec<PeerInfo>>;
    /**
     * Get a custom set of properties as a JSON object, defined in the chain spec
     **/
    properties: () => Promise<ChainProperties>;
    /**
     * Remove a reserved peer
     **/
    removeReservedPeer: (peerId: Text | string) => Promise<Text>;
    /**
     * Returns the list of reserved peers
     **/
    reservedPeers: () => Promise<Vec<Text>>;
    /**
     * Resets the log filter to Substrate defaults
     **/
    resetLogFilter: () => Promise<Null>;
    /**
     * Returns the state of the syncing of the node
     **/
    syncState: () => Promise<SyncState>;
    /**
     * Retrieves the version of the node
     **/
    version: () => Promise<Text>;
  };
  web3: {
    /**
     * Returns current client version.
     **/
    clientVersion: () => Promise<Text>;
    /**
     * Returns sha3 of the given data
     **/
    sha3: (data: Bytes | string | Uint8Array) => Promise<H256>;
  };
} // SimpleRpcInterface

/**
 * @description
 * Contains a nested list of all the rpc methods exposed. However, this const is not used. Because it turns out that it is identical for all networks as no information about the network is included in the edgeware.json file.
 * For that, a list of rpc methods is saved for each network after calling rpc_methods endpoint to get the list.
 * @remarks
 * This const is not used. But it is kept as it could be used later because this project is a PoC and in the process of seeking the best approach.
 * This const in not inside a module augmentation because the compiler does not allow.
 * Additionally, this module augmentation causes confusion to TypeScript compiler, when used inside another project, tricking it to see every property as `any`.
 */
/*
export const RpcList = {
  author : [
    'hasKey',
    'hasSessionKeys',
    'insertKey',
    'pendingExtrinsics',
    'removeExtrinsic',
    'rotateKeys',
    'submitAndWatchExtrinsic',
    'submitExtrinsic',
  ],
  babe : [
    'epochAuthorship',
  ],
  beefy : [
    'getFinalizedHead',
    'subscribeJustifications',
  ],
  chain : [
    'getBlock',
    'getBlockHash',
    'getFinalizedHead',
    'getHeader',
    'subscribeAllHeads',
    'subscribeFinalizedHeads',
    'subscribeNewHeads',
  ],
  childstate : [
    'getKeys',
    'getKeysPaged',
    'getStorage',
    'getStorageEntries',
    'getStorageHash',
    'getStorageSize',
  ],
  contracts : [
    'call',
    'getStorage',
    'instantiate',
    'rentProjection',
    'uploadCode',
  ],
  dev : [
    'getBlockStats',
  ],
  engine : [
    'createBlock',
    'finalizeBlock',
  ],
  eth : [
    'accounts',
    'blockNumber',
    'call',
    'chainId',
    'coinbase',
    'estimateGas',
    'feeHistory',
    'gasPrice',
    'getBalance',
    'getBlockByHash',
    'getBlockByNumber',
    'getBlockTransactionCountByHash',
    'getBlockTransactionCountByNumber',
    'getCode',
    'getFilterChanges',
    'getFilterLogs',
    'getLogs',
    'getProof',
    'getStorageAt',
    'getTransactionByBlockHashAndIndex',
    'getTransactionByBlockNumberAndIndex',
    'getTransactionByHash',
    'getTransactionCount',
    'getTransactionReceipt',
    'getUncleByBlockHashAndIndex',
    'getUncleByBlockNumberAndIndex',
    'getUncleCountByBlockHash',
    'getUncleCountByBlockNumber',
    'getWork',
    'hashrate',
    'maxPriorityFeePerGas',
    'mining',
    'newBlockFilter',
    'newFilter',
    'newPendingTransactionFilter',
    'protocolVersion',
    'sendRawTransaction',
    'sendTransaction',
    'submitHashrate',
    'submitWork',
    'subscribe',
    'syncing',
    'uninstallFilter',
  ],
  grandpa : [
    'proveFinality',
    'roundState',
    'subscribeJustifications',
  ],
  mmr : [
    'generateProof',
    'root',
    'verifyProof',
    'verifyProofStateless',
  ],
  net : [
    'listening',
    'peerCount',
    'version',
  ],
  offchain : [
    'localStorageGet',
    'localStorageSet',
  ],
  payment : [
    'queryFeeDetails',
    'queryInfo',
  ],
  rpc : [
    'methods',
  ],
  state : [
    'call',
    'getChildKeys',
    'getChildReadProof',
    'getChildStorage',
    'getChildStorageHash',
    'getChildStorageSize',
    'getKeys',
    'getKeysPaged',
    'getMetadata',
    'getPairs',
    'getReadProof',
    'getRuntimeVersion',
    'getStorage',
    'getStorageHash',
    'getStorageSize',
    'queryStorage',
    'queryStorageAt',
    'subscribeRuntimeVersion',
    'subscribeStorage',
    'traceBlock',
    'trieMigrationStatus',
  ],
  syncstate : [
    'genSyncSpec',
  ],
  system : [
    'accountNextIndex',
    'addLogFilter',
    'addReservedPeer',
    'chain',
    'chainType',
    'dryRun',
    'health',
    'localListenAddresses',
    'localPeerId',
    'name',
    'networkState',
    'nodeRoles',
    'peers',
    'properties',
    'removeReservedPeer',
    'reservedPeers',
    'resetLogFilter',
    'syncState',
    'version',
  ],
  web3 : [
    'clientVersion',
    'sha3',
  ],
} as const;
*/

/**
 * @description
 * An empty abstract class implementing SimpleRpcInterface.
 * @remarks
 * This class is not used. But it is kept as it could be used later because this project is a PoC and in the process of seeking the best approach.
 * This class in not inside a module augmentation because the compiler does not allow.
 * Additionally, this module augmentation causes confusion to TypeScript Intellisense, when used inside another project.
 */ 
/*
import { SimpleRpcInterface} from '@polkadot/rpc-core/types/jsonrpc';
export class RpcBaseClass implements SimpleRpcInterface {
  public get author() {
    return {
      hasKey: (publicKey: Bytes | string | Uint8Array, keyType: Text | string): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      hasSessionKeys: (sessionKeys: Bytes | string | Uint8Array): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      insertKey: (keyType: Text | string, suri: Text | string, publicKey: Bytes | string | Uint8Array): Observable<Bytes> => {
        throw new Error('Function not implemented.');
      },
      pendingExtrinsics: (): Observable<Vec<Extrinsic>> => {
        throw new Error('Function not implemented.');
      },
      removeExtrinsic: (bytesOrHash: Vec<ExtrinsicOrHash> | (ExtrinsicOrHash | { Hash: any } | { Extrinsic: any } | string | Uint8Array)[]): Observable<Vec<Hash>> => {
        throw new Error('Function not implemented.');
      },
      rotateKeys: (): Observable<Bytes> => {
        throw new Error('Function not implemented.');
      },
      submitAndWatchExtrinsic: (extrinsic: Extrinsic | IExtrinsic | string | Uint8Array): Observable<ExtrinsicStatus> => {
        throw new Error('Function not implemented.');
      },
      submitExtrinsic: (extrinsic: Extrinsic | IExtrinsic | string | Uint8Array): Observable<Hash> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get babe() {
    return {
      epochAuthorship: (): Observable<HashMap<AuthorityId, EpochAuthorship>> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get beefy() {
    return {
      getFinalizedHead: (): Observable<H256> => {
        throw new Error('Function not implemented.');
      },
      subscribeJustifications: (): Observable<BeefyVersionedFinalityProof> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get chain() {
    return {
      getBlock: (hash?: BlockHash | string | Uint8Array): Observable<SignedBlock> => {
        throw new Error('Function not implemented.');
      },
      getBlockHash: (blockNumber?: BlockNumber | AnyNumber | Uint8Array): Observable<BlockHash> => {
        throw new Error('Function not implemented.');
      },
      getFinalizedHead: (): Observable<BlockHash> => {
        throw new Error('Function not implemented.');
      },
      getHeader: (hash?: BlockHash | string | Uint8Array): Observable<Header> => {
        throw new Error('Function not implemented.');
      },
      subscribeAllHeads: (): Observable<Header> => {
        throw new Error('Function not implemented.');
      },
      subscribeFinalizedHeads: (): Observable<Header> => {
        throw new Error('Function not implemented.');
      },
      subscribeNewHeads: (): Observable<Header> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get childstate() {
    return {
      getKeys: (childKey: PrefixedStorageKey | string | Uint8Array, prefix: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array): Observable<Vec<StorageKey>> => {
        throw new Error('Function not implemented.');
      },
      getKeysPaged: (childKey: PrefixedStorageKey | string | Uint8Array, prefix: StorageKey | string | Uint8Array | any, count: u32 | AnyNumber | Uint8Array, startKey?: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array): Observable<Vec<StorageKey>> => {
        throw new Error('Function not implemented.');
      },
      getStorage: (childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array): Observable<Option<StorageData>> => {
        throw new Error('Function not implemented.');
      },
      getStorageEntries: (childKey: PrefixedStorageKey | string | Uint8Array, keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: Hash | string | Uint8Array): Observable<Vec<Option<StorageData>>> => {
        throw new Error('Function not implemented.');
      },
      getStorageHash: (childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array): Observable<Option<Hash>> => {
        throw new Error('Function not implemented.');
      },
      getStorageSize: (childKey: PrefixedStorageKey | string | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: Hash | string | Uint8Array): Observable<Option<u64>> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get contracts() {
    return {
      call: (callRequest: ContractCallRequest | { origin?: any; dest?: any; value?: any; gasLimit?: any; storageDepositLimit?: any; inputData?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<ContractExecResult> => {
        throw new Error('Function not implemented.');
      },
      getStorage: (address: AccountId | string | Uint8Array, key: H256 | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<Option<Bytes>> => {
        throw new Error('Function not implemented.');
      },
      instantiate: (request: InstantiateRequestV1 | { origin?: any; value?: any; gasLimit?: any; code?: any; data?: any; salt?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<ContractInstantiateResult> => {
        throw new Error('Function not implemented.');
      },
      rentProjection: (address: AccountId | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<Option<BlockNumber>> => {
        throw new Error('Function not implemented.');
      },
      uploadCode: (uploadRequest: CodeUploadRequest | { origin?: any; code?: any; storageDepositLimit?: any } | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<CodeUploadResult> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get dev() {
    return {
      getBlockStats: (at: Hash | string | Uint8Array): Observable<Option<BlockStats>> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get engine() {
    return {
      createBlock: (createEmpty: bool | boolean | Uint8Array, finalize: bool | boolean | Uint8Array, parentHash?: BlockHash | string | Uint8Array): Observable<CreatedBlock> => {
        throw new Error('Function not implemented.');
      },
      finalizeBlock: (hash: BlockHash | string | Uint8Array, justification?: Justification): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get eth() {
    return {
      accounts: (): Observable<Vec<H160>> => {
        throw new Error('Function not implemented.');
      },
      blockNumber: (): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      call: (request: EthCallRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array): Observable<Bytes> => {
        throw new Error('Function not implemented.');
      },
      chainId: (): Observable<U64> => {
        throw new Error('Function not implemented.');
      },
      coinbase: (): Observable<H160> => {
        throw new Error('Function not implemented.');
      },
      estimateGas: (request: EthCallRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      feeHistory: (blockCount: U256 | AnyNumber | Uint8Array, newestBlock: BlockNumber | AnyNumber | Uint8Array, rewardPercentiles: Option<Vec<f64>> | null | Uint8Array | Vec<f64> | (f64)[]): Observable<EthFeeHistory> => {
        throw new Error('Function not implemented.');
      },
      gasPrice: (): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getBalance: (address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getBlockByHash: (hash: H256 | string | Uint8Array, full: bool | boolean | Uint8Array): Observable<Option<EthRichBlock>> => {
        throw new Error('Function not implemented.');
      },
      getBlockByNumber: (block: BlockNumber | AnyNumber | Uint8Array, full: bool | boolean | Uint8Array): Observable<Option<EthRichBlock>> => {
        throw new Error('Function not implemented.');
      },
      getBlockTransactionCountByHash: (hash: H256 | string | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getBlockTransactionCountByNumber: (block: BlockNumber | AnyNumber | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getCode: (address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array): Observable<Bytes> => {
        throw new Error('Function not implemented.');
      },
      getFilterChanges: (index: U256 | AnyNumber | Uint8Array): Observable<EthFilterChanges> => {
        throw new Error('Function not implemented.');
      },
      getFilterLogs: (index: U256 | AnyNumber | Uint8Array): Observable<Vec<EthLog>> => {
        throw new Error('Function not implemented.');
      },
      getLogs: (filter: EthFilter | { fromBlock?: any; toBlock?: any; blockHash?: any; address?: any; topics?: any } | string | Uint8Array): Observable<Vec<EthLog>> => {
        throw new Error('Function not implemented.');
      },
      getProof: (address: H160 | string | Uint8Array, storageKeys: Vec<H256> | (H256 | string | Uint8Array)[], number: BlockNumber | AnyNumber | Uint8Array): Observable<EthAccount> => {
        throw new Error('Function not implemented.');
      },
      getStorageAt: (address: H160 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array): Observable<H256> => {
        throw new Error('Function not implemented.');
      },
      getTransactionByBlockHashAndIndex: (hash: H256 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array): Observable<EthTransaction> => {
        throw new Error('Function not implemented.');
      },
      getTransactionByBlockNumberAndIndex: (number: BlockNumber | AnyNumber | Uint8Array, index: U256 | AnyNumber | Uint8Array): Observable<EthTransaction> => {
        throw new Error('Function not implemented.');
      },
      getTransactionByHash: (hash: H256 | string | Uint8Array): Observable<EthTransaction> => {
        throw new Error('Function not implemented.');
      },
      getTransactionCount: (address: H160 | string | Uint8Array, number?: BlockNumber | AnyNumber | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getTransactionReceipt: (hash: H256 | string | Uint8Array): Observable<EthReceipt> => {
        throw new Error('Function not implemented.');
      },
      getUncleByBlockHashAndIndex: (hash: H256 | string | Uint8Array, index: U256 | AnyNumber | Uint8Array): Observable<EthRichBlock> => {
        throw new Error('Function not implemented.');
      },
      getUncleByBlockNumberAndIndex: (number: BlockNumber | AnyNumber | Uint8Array, index: U256 | AnyNumber | Uint8Array): Observable<EthRichBlock> => {
        throw new Error('Function not implemented.');
      },
      getUncleCountByBlockHash: (hash: H256 | string | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getUncleCountByBlockNumber: (number: BlockNumber | AnyNumber | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      getWork: (): Observable<EthWork> => {
        throw new Error('Function not implemented.');
      },
      hashrate: (): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      maxPriorityFeePerGas: (): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      mining: (): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      newBlockFilter: (): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      newFilter: (filter: EthFilter | { fromBlock?: any; toBlock?: any; blockHash?: any; address?: any; topics?: any } | string | Uint8Array): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      newPendingTransactionFilter: (): Observable<U256> => {
        throw new Error('Function not implemented.');
      },
      protocolVersion: (): Observable<u64> => {
        throw new Error('Function not implemented.');
      },
      sendRawTransaction: (bytes: Bytes | string | Uint8Array): Observable<H256> => {
        throw new Error('Function not implemented.');
      },
      sendTransaction: (tx: EthTransactionRequest | { from?: any; to?: any; gasPrice?: any; gas?: any; value?: any; data?: any; nonce?: any } | string | Uint8Array): Observable<H256> => {
        throw new Error('Function not implemented.');
      },
      submitHashrate: (index: U256 | AnyNumber | Uint8Array, hash: H256 | string | Uint8Array): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      submitWork: (nonce: H64 | string | Uint8Array, headerHash: H256 | string | Uint8Array, mixDigest: H256 | string | Uint8Array): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      subscribe: (kind: EthSubKind | 'newHeads' | 'logs' | 'newPendingTransactions' | 'syncing' | number | Uint8Array, params?: EthSubParams | { None: any } | { Logs: any } | string | Uint8Array): Observable<Null> => {
        throw new Error('Function not implemented.');
      },
      syncing: (): Observable<EthSyncStatus> => {
        throw new Error('Function not implemented.');
      },
      uninstallFilter: (index: U256 | AnyNumber | Uint8Array): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get grandpa() {
    return {
      proveFinality: (blockNumber: BlockNumber | AnyNumber | Uint8Array): Observable<Option<EncodedFinalityProofs>> => {
        throw new Error('Function not implemented.');
      },
      roundState: (): Observable<ReportedRoundStates> => {
        throw new Error('Function not implemented.');
      },
      subscribeJustifications: (): Observable<JustificationNotification> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get mmr() {
    return {
      generateProof: (blockNumbers: Vec<u64> | (u64 | AnyNumber | Uint8Array)[], bestKnownBlockNumber?: u64 | AnyNumber | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<MmrLeafBatchProof> => {
        throw new Error('Function not implemented.');
      },
      root: (at?: BlockHash | string | Uint8Array): Observable<MmrHash> => {
        throw new Error('Function not implemented.');
      },
      verifyProof: (proof: MmrLeafBatchProof | { blockHash?: any; leaves?: any; proof?: any } | string | Uint8Array): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      verifyProofStateless: (root: MmrHash | string | Uint8Array, proof: MmrLeafBatchProof | { blockHash?: any; leaves?: any; proof?: any } | string | Uint8Array): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get net() {
    return {
      listening: (): Observable<bool> => {
        throw new Error('Function not implemented.');
      },
      peerCount: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      version: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get offchain() {
    return {
      localStorageGet: (kind: StorageKind | 'PERSISTENT' | 'LOCAL' | number | Uint8Array, key: Bytes | string | Uint8Array): Observable<Option<Bytes>> => {
        throw new Error('Function not implemented.');
      },
      localStorageSet: (kind: StorageKind | 'PERSISTENT' | 'LOCAL' | number | Uint8Array, key: Bytes | string | Uint8Array, value: Bytes | string | Uint8Array): Observable<Null> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get payment() {
    return {
      queryFeeDetails: (extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<FeeDetails> => {
        throw new Error('Function not implemented.');
      },
      queryInfo: (extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<RuntimeDispatchInfoV1> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get rpc() {
    return {
      methods: (): Observable<RpcMethods> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get state() {
    return {
      call: (method: Text | string, data: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<Bytes> => {
        throw new Error('Function not implemented.');
      },
      getChildKeys: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<Vec<StorageKey>> => {
        throw new Error('Function not implemented.');
      },
      getChildReadProof: (childStorageKey: PrefixedStorageKey | string | Uint8Array, keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: BlockHash | string | Uint8Array): Observable<ReadProof> => {
        throw new Error('Function not implemented.');
      },
      getChildStorage: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<StorageData> => {
        throw new Error('Function not implemented.');
      },
      getChildStorageHash: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<Hash> => {
        throw new Error('Function not implemented.');
      },
      getChildStorageSize: (childStorageKey: StorageKey | string | Uint8Array | any, childDefinition: StorageKey | string | Uint8Array | any, childType: u32 | AnyNumber | Uint8Array, key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<u64> => {
        throw new Error('Function not implemented.');
      },
      getKeys: (key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<Vec<StorageKey>> => {
        throw new Error('Function not implemented.');
      },
      getKeysPaged: (key: StorageKey | string | Uint8Array | any, count: u32 | AnyNumber | Uint8Array, startKey?: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<Vec<StorageKey>> => {
        throw new Error('Function not implemented.');
      },
      getMetadata: (at?: BlockHash | string | Uint8Array): Observable<Metadata> => {
        throw new Error('Function not implemented.');
      },
      getPairs: (prefix: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<Vec<KeyValue>> => {
        throw new Error('Function not implemented.');
      },
      getReadProof: (keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: BlockHash | string | Uint8Array): Observable<ReadProof> => {
        throw new Error('Function not implemented.');
      },
      getRuntimeVersion: (at?: BlockHash | string | Uint8Array): Observable<RuntimeVersion> => {
        throw new Error('Function not implemented.');
      },
      getStorage: <T = Codec>(key: StorageKey | string | Uint8Array | any, block?: Hash | Uint8Array | string): Observable<T> => {
        throw new Error('Function not implemented.');
      },
      getStorageHash: (key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<Hash> => {
        throw new Error('Function not implemented.');
      },
      getStorageSize: (key: StorageKey | string | Uint8Array | any, at?: BlockHash | string | Uint8Array): Observable<u64> => {
        throw new Error('Function not implemented.');
      },
      queryStorage: <T = Codec[]>(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], fromBlock?: Hash | Uint8Array | string, toBlock?: Hash | Uint8Array | string): Observable<[Hash, T][]> => {
        throw new Error('Function not implemented.');
      },
      queryStorageAt: <T = Codec[]>(keys: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[], at?: Hash | Uint8Array | string): Observable<T> => {
        throw new Error('Function not implemented.');
      },
      subscribeRuntimeVersion: (): Observable<RuntimeVersion> => {
        throw new Error('Function not implemented.');
      },
      subscribeStorage: <T = Codec[]>(keys?: Vec<StorageKey> | (StorageKey | string | Uint8Array | any)[]): Observable<T> => {
        throw new Error('Function not implemented.');
      },
      traceBlock: (block: Hash | string | Uint8Array, targets: Option<Text> | null | Uint8Array | Text | string, storageKeys: Option<Text> | null | Uint8Array | Text | string, methods: Option<Text> | null | Uint8Array | Text | string): Observable<TraceBlockResponse> => {
        throw new Error('Function not implemented.');
      },
      trieMigrationStatus: (at?: BlockHash | string | Uint8Array): Observable<MigrationStatusResult> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get syncstate() {
    return {
      genSyncSpec: (raw: bool | boolean | Uint8Array): Observable<Json> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get system() {
    return {
      accountNextIndex: (accountId: AccountId | string | Uint8Array): Observable<Index> => {
        throw new Error('Function not implemented.');
      },
      addLogFilter: (directives: Text | string): Observable<Null> => {
        throw new Error('Function not implemented.');
      },
      addReservedPeer: (peer: Text | string): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      chain: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      chainType: (): Observable<ChainType> => {
        throw new Error('Function not implemented.');
      },
      dryRun: (extrinsic: Bytes | string | Uint8Array, at?: BlockHash | string | Uint8Array): Observable<ApplyExtrinsicResult> => {
        throw new Error('Function not implemented.');
      },
      health: (): Observable<Health> => {
        throw new Error('Function not implemented.');
      },
      localListenAddresses: (): Observable<Vec<Text>> => {
        throw new Error('Function not implemented.');
      },
      localPeerId: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      name: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      networkState: (): Observable<NetworkState> => {
        throw new Error('Function not implemented.');
      },
      nodeRoles: (): Observable<Vec<NodeRole>> => {
        throw new Error('Function not implemented.');
      },
      peers: (): Observable<Vec<PeerInfo>> => {
        throw new Error('Function not implemented.');
      },
      properties: (): Observable<ChainProperties> => {
        throw new Error('Function not implemented.');
      },
      removeReservedPeer: (peerId: Text | string): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      reservedPeers: (): Observable<Vec<Text>> => {
        throw new Error('Function not implemented.');
      },
      resetLogFilter: (): Observable<Null> => {
        throw new Error('Function not implemented.');
      },
      syncState: (): Observable<SyncState> => {
        throw new Error('Function not implemented.');
      },
      version: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
    }
  };
  public get web3() {
    return {
      clientVersion: (): Observable<Text> => {
        throw new Error('Function not implemented.');
      },
      sha3: (data: Bytes | string | Uint8Array): Observable<H256> => {
        throw new Error('Function not implemented.');
      },
    }
  };
} // RpcBaseClass
*/

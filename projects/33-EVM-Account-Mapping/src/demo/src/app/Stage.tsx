'use client';

import { useState, useEffect } from 'react'
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import type { u16, u32, u128, Struct } from '@polkadot/types'
import { atom, useAtom, useSetAtom, useAtomValue, type Getter, type Atom } from 'jotai'
import { atomWithReset, RESET } from 'jotai/utils'
import { custom, createWalletClient, type WalletClient } from 'viem'
import { mainnet } from 'viem/chains'
import dedent from 'dedent'
import { CheckCircleIcon, ExclamationCircleIcon, ArrowPathIcon, LightBulbIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'

import { getMappingAccount, type MappingAccount, signAndSend, signAndSendEvm } from 'evm_account_mapping_sdk'

//
// types
//

export interface FrameSystemAccountInfo extends Struct {
  readonly nonce: u32
  readonly consumers: u32
  readonly providers: u32
  readonly sufficients: u32
  readonly data: PalletBalancesAccountData
}

interface PalletBalancesAccountData extends Struct {
  readonly free: u128
  readonly reserved: u128
  readonly frozen: u128
  readonly flags: u128
}

//
// Atoms
//

type ConnectState<TInstance = unknown> = {
  connected: false
  connecting: false
  instance?: null | undefined
} | {
  connected: false
  connecting: true
  instance?: null | undefined
} | {
  connected: true
  connecting: false
  instance: TInstance
}

interface AtomWithConnectStateOptions {
  autoConnect?: boolean
}

function atomWithConnectState<
  T
>(
  connect: (get: Getter) => Promise<T | undefined | null>,
  options?: AtomWithConnectStateOptions
) {
  const innerAtom = atom<ConnectState<T>>({ connected: false, connecting: false, instance: null })
  const outerAtom = atom(
    get => get(innerAtom),
    async (get, set, action: { type: 'connect' | 'disconnect' }) => {
      if (action.type === 'connect') {
        set(innerAtom, { connected: false, connecting: true, instance: null })
        const instance = await connect(get)
        if (!instance) {
          set(innerAtom, { connected: false, connecting: false, instance: null })
        } else {
          set(innerAtom, { connected: true, connecting: false, instance })
        }
        return instance
      }
      if (action.type === 'disconnect') {
        const prev = get(innerAtom)
        if (prev.instance) {
          // @ts-ignore
          prev.instance.disconnect()
        }
        set(innerAtom, { connected: false, connecting: false, instance: null })
      }
    }
  )
  if (options?.autoConnect) {
    outerAtom.onMount = (set) => {
      if (typeof window !== 'undefined') {
        set({ type: 'connect' })
      }
    }
  }
  return outerAtom
}

const rpcAtom = atomWithReset('wss://poc6.phala.network/ws')

const apiPromiseAtom = atomWithConnectState(
  async function (get) {
    const endpoint = get(rpcAtom)
    const apiPromise = await ApiPromise.create({
      provider: new WsProvider(endpoint),
      noInitWarn: true,
    })
    return apiPromise
  },
)

const mappedAccountAtom = atom<MappingAccount | null>(null)

// https://poc6-statescan.phala.network/extrinsics/{trxId}
const blockExplorerAtom = atomWithReset('https://poc6-statescan.phala.network')

const isSupportedAtom = atom(true)

const walletClientAtom = atom<WalletClient | null>(null)

//
// Components
//

function RpcInput() {
  const [rpc, setRpc] = useAtom(rpcAtom)
  return (
    <div>
      <label htmlFor="rpc" className="sr-only">
        WS Endpoint
      </label>
      <div className="relative mt-2 flex items-center">
        <input
          name="rpc"
          id="rpc"
          value={rpc}
          onChange={ev => setRpc(ev.target.value)}
          className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono pr-16"
          placeholder="ws://127.0.0.1:9944"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <button
            className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
            onClick={(ev) => {
              ev.preventDefault()
              setRpc(RESET)
            }}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  )
}

function BlockExploerInput() {
  const [blockExplorer, setBlockExplorer] = useAtom(blockExplorerAtom)
  return (
    <div>
      <label htmlFor="blockExplorer" className="sr-only">
        Block Explorer
      </label>
      <div className="relative mt-2 flex items-center">
        <input
          name="blockExplorer"
          id="blockExplorer"
          className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono pr-16"
          value={blockExplorer}
          onChange={ev => setBlockExplorer(ev.target.value)}
          placeholder="Block Explorer URL, e.g. https://poc6-statescan.phala.network or https://phala.subscan.io"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <button
            className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400"
            onClick={(ev) => {
              ev.preventDefault()
              setBlockExplorer(RESET)
            }}
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Prompt the user to connect their wallet and request signing for compressed pubkey.
 */
function ConnectButton() {
  const [{ instance: apiPromise, connected }, dispatch] = useAtom(apiPromiseAtom)
  const setMappingAccount = useSetAtom(mappedAccountAtom)
  const [isPending, setIsPending] = useState(false)
  const setIsSupport = useSetAtom(isSupportedAtom)
  const setWalletClient = useSetAtom(walletClientAtom)
  return (
    <button
      className="rounded-md bg-indigo-600 mt-2 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-200"
      disabled={isPending || connected}
      onClick={async () => {
        try {
          setIsPending(true)
          let _api = apiPromise
          if (_api) {
            await dispatch({ type: 'disconnect' })
          }
          _api = await dispatch({ type: 'connect' })
          if (!_api!.consts?.evmAccountMapping?.eip712ChainID) {
            setIsSupport(false)
            return
          }
          const walletClient = createWalletClient({ chain: mainnet, transport: custom((window as any).ethereum) })
          const [address] = await walletClient.requestAddresses()
          setWalletClient(walletClient)
          const SS58Prefix = (_api!.consts.system?.ss58Prefix as u16).toNumber()
          const mappedAccount = await getMappingAccount(walletClient, { address: address }, { SS58Prefix })
          setMappingAccount(mappedAccount)
          setIsSupport(true)
        } finally {
          setIsPending(false)
        }
      }}
    >
      {isPending ? (
        <ArrowPathIcon className="w-4 h-4 animate-spin" />
      ) : connected ? "connected" : "Connect"}
    </button>
  )
}

function SupportedStatement() {
  const isSupported = useAtomValue(isSupportedAtom)
  const { connected } = useAtomValue(apiPromiseAtom)
  if (isSupported || !connected) {
    return null
  }
  return (
    <div className="rounded-md bg-red-50 p-4 mx-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Unsupported Chain</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>This chain since don&apos;t include evm_account_mapping pallet</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MappingAddress() {
  const mappedAccount = useAtomValue(mappedAccountAtom)
  const blockExplorer = useAtomValue(blockExplorerAtom)
  const prefix = blockExplorer.indexOf('subscan') !== -1 ? 'account' : 'accounts'
  if (!mappedAccount) {
    return null
  }
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Mapping Account</h3>
        <div className="pt-4 px-2.5 bg-stone-50 rounded-sm border border-stone-200 mt-4">
          <LightBulbIcon className="w-4 h-4 text-yellow-400 hidden sm:block sm:float-left sm:mt-1.5" />
          <article className="prose prose-stone sm:ml-7 max-w-4xl prose-a:text-gray-500">
            <p>
              Here is the current connected account's address and its mapping substrate address in SS58 format. It is generated using the same private key, but it does not require access to your private key. Instead, it is calculated based on the public key of your wallet.
            </p>
            <p>
              You can export your private key from your EVM compatible wallet and import it into any Polkadot compatible wallet, such as the <a href="https://polkadot.js.org/extension/" target="_blank">Polkadot.js</a> extension.
            </p>
            <p>
            </p>
          </article>
        </div>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <div className="mt-6 border-t border-gray-100 md:min-w-[660px]">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-2.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">EVM Address</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 font-mono overflow-x-scroll md:overflow-auto scroll-smooth py-2">
                  {mappedAccount?.evmAddress}
                </dd>
              </div>
              <div className="px-4 py-2.5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 flex items-center">Mapping Substrate Address</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 font-mono overflow-x-scroll md:overflow-auto scroll-smooth py-2">
                  <a href={`${blockExplorer}/${prefix}/${mappedAccount?.address}`} target="_blank" className="inline-flex gap-1.5 items-center">
                    {mappedAccount?.address}
                    <span><ArrowTopRightOnSquareIcon className="w-4 h-4 text-blue-600" /></span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

const formatter = new Intl.NumberFormat('en-US')

const claimTestTokenTrxIdAtom = atom('')

function AccountBalance() {
  const { instance: apiPromise } = useAtomValue(apiPromiseAtom)
  const mappedAccount = useAtomValue(mappedAccountAtom)
  const [balance, setBalance] = useState(BigInt(0))
  useEffect(() => {
    if (!apiPromise || !mappedAccount) {
      return
    }
    let unsub: any = () => {}
    (async function() {
      unsub = await apiPromise.query.system.account(
        mappedAccount.address,
        (info: FrameSystemAccountInfo) => setBalance(info.data.free.toBigInt()))
    })()
    return () => {
      setBalance(BigInt(0))
      unsub && unsub()
    }
  }, [apiPromise, mappedAccount, setBalance])
  return (
    <div>
      <div className="dark:text-gray-900">
        <span className="text-gray-500 mr-1">Balance:</span>
        <span className="font-mono font-medium">{formatter.format(Number(balance / BigInt(1e8)) / 1e4)}</span>
        <span className="text-sm text-gray-500 ml-1">Unit</span>
      </div>
    </div>
  )
}

function ClaimTestToken() {
  const { instance: apiPromise } = useAtomValue(apiPromiseAtom)
  const mappedAccount = useAtomValue(mappedAccountAtom)
  const [isPending, setIsPending] = useState(false)
  const setTrxId = useSetAtom(claimTestTokenTrxIdAtom)
  if (!apiPromise || !mappedAccount) {
    return null
  }
  return (
    <button
      className={
        isPending
        ? "min-h-[28px] rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        : "rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      }
      onClick={async () => {
        try {
          setIsPending(true)
          setTrxId('')
          const keyring = new Keyring({ type: 'sr25519' })
          const alice = keyring.addFromUri('//Alice')
          const result = await signAndSend(apiPromise.tx.balances.transferAllowDeath(mappedAccount.address, 1e12 * 10), alice)
          const trxId = result.status.asInBlock.toHex()
          setTrxId(trxId)
        } finally {
          setIsPending(false)
        } 
      }}
    >
      {isPending ? (
        <ArrowPathIcon className="w-4 h-4 animate-spin" />
      ) : "Claim Test Tokens"}
    </button>
  )
}

function ViewTrxHelpText({ theAtom }: { theAtom: Atom<string> }) {
  const trxId = useAtomValue(theAtom)
  const blockExplorer = useAtomValue(blockExplorerAtom)
  const rpc = useAtomValue(rpcAtom)
  if (!trxId) {
    return null
  }
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">In Block</h3>
          <div className="mt-2 text-sm text-green-700 overflow-x-scroll w-64 sm:w-auto">
            <p>Extrinsic <code>{trxId}</code> already in block.</p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex flex-col sm:flex-row gap-2.5">
              <a
                href={`https://polkadot.js.org/apps/?rpc=${rpc}#/explorer/query/${trxId}`}
                target="_blank"
                className="rounded-md bg-green-200 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                View on Polkadot Portal
              </a>
              {blockExplorer ? (
              <a
                href={`${blockExplorer}/blocks/${trxId}`}
                target="_blank"
                className="rounded-md bg-green-200 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              >
                View on StateScan
              </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const transferOutTrxIdAtom = atom('')

function TransferToAddress() {
  const { instance: apiPromise } = useAtomValue(apiPromiseAtom)
  const mappedAccount = useAtomValue(mappedAccountAtom)
  const walletClient = useAtomValue(walletClientAtom)
  const [isPending, setIsPending] = useState(false)
  const setTrxId = useSetAtom(transferOutTrxIdAtom)
  const enabled = apiPromise && mappedAccount && walletClient
  return (
    <form onSubmit={async (ev) => {
      try {
        ev.preventDefault()
        const data = Array.from(new FormData(ev.target as HTMLFormElement).entries()).reduce((acc, [key, value]) => {
          acc[key] = value as string
          return acc
        }, {} as Record<string, string>)
        if (!apiPromise || !mappedAccount || !walletClient) {
          return
        }
        setIsPending(true)
        setTrxId('')
        const amount = (Number(data.amount) * 1e4).toFixed(0)
        const result = await signAndSendEvm(
          apiPromise.tx.balances.transferAllowDeath(data.address, BigInt(1e8) * BigInt(amount)),
          apiPromise,
          walletClient,
          mappedAccount,
        )
        const trxId = result.status.asInBlock.toHex()
        setTrxId(trxId)
      } finally {
        setIsPending(false)
      }
    }}>
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
        <div className="grow w-full sm:w-auto">
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              disabled={!enabled}
              type="text"
              name="address"
              className="block w-full rounded-md border-0 px-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono"
              placeholder="substrate address"
              defaultValue="45R2pfjQUW2s9PQRHU48HQKLKHVMaDja7N3wpBtmF28UYDs2"
            />
          </div>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative mt-2 rounded-md shadow-sm">
            <input
              disabled={!enabled}
              name="amount"
              id="amount"
              className="block w-full rounded-md border-0 py-1.5 pl-2.5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="0.00"
              defaultValue="1"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">
                Unit
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <button
            type="submit"
            disabled={!enabled}
            className={
              isPending
              ? "rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              : (
                enabled
                  ? "rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  : "rounded bg-gray-300 cursor-not-allowed px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              )
            }
          >
            {isPending ? (
              <ArrowPathIcon className="w-4 h-4 animate-spin" />
            ) : "Transfer"}
          </button>
        </div>
      </div>
    </form>
  )
}

function ClaimTestTokenHelpText() {
  const { connected } = useAtomValue(apiPromiseAtom)
  const rpc = useAtomValue(rpcAtom)
  const blockExplorer = useAtomValue(blockExplorerAtom)
  return (
    <div className="py-4 px-2.5 bg-stone-50 rounded-sm border border-stone-200">
      <LightBulbIcon className="w-4 h-4 text-yellow-400 hidden sm:block sm:float-left sm:mt-1.5" />
      <article className="prose prose-stone sm:ml-7 max-w-4xl prose-a:text-gray-500">
        {!connected ? (
          <p>
            You need to connect your wallet in order to see the balance.
          </p>
        ) : (
          <p>
            Once you have connected to the supported node and signed the signature, it is ready for use. You can transfer funds into the mapping account and check the balance using
            either <a href={`https://polkadot.js.org/apps/?rpc=${rpc}#/explorer`} target="_blank">Polkadot/Substrate Portal</a> or <a href={blockExplorer} target="_blank">Block Explorer</a>.
          </p>
        )}
      </article>
    </div>
  )
}

//
// Compose together
//


export function Stage() {
  return (
    <div className="w-full md:min-w-[600px] md:max-w-4xl flex flex-col gap-4 pb-16">
      <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white font-serif tracking-wide">
        EVM Account Mapping Pallet for Substrate
      </h1>

      <div className="bg-white shadow sm:rounded-lg py-5 px-2.5 sm:p-6 flex flex-col gap-2.5">
        <div className="pt-4 px-2.5 bg-stone-50 rounded-sm border border-stone-200">
          <LightBulbIcon className="w-4 h-4 text-yellow-400 hidden sm:block sm:float-left mt-1.5" />
          <article className="prose prose-stone sm:ml-7 max-w-4xl prose-a:text-gray-500">
            <p>
              You need connect to a Substrate node with <code>evm_account_mapping</code> pallet. Or you can build your own test node here: <a href="https://github.com/Phala-Network/substrate-evm_account_mapping" target="_blank">github.com/Phala-Network/substrate-evm_account_mapping</a>.
            </p>
            <p>
              Click the <q>Connect</q> button to connect to the node. It will check if the node supports the <code>evm_account_mapping</code> pallet and automatically compute the mapping substrate address.
              Your have Signing the signature is required to continue, both <a href="https://metamask.io/" target="_blank">MetaMask</a> and <a href="https://rabby.io/" target="_blank">Rabby Wallet</a> has been tested, but it should work with any injected EVM compatible cryptocurrency wallet.
            </p>
            <p>
            </p>
          </article>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <form className="flex flex-col gap-2.5 grow">
            <RpcInput />
            <BlockExploerInput />
          </form>
          <div>
            <ConnectButton />
          </div>
        </div>
        <SupportedStatement />
      </div>

      <MappingAddress />

      <div className="bg-white shadow sm:rounded-lg flex flex-col gap-2.5 px-4 py-5 sm:p-6">
        <ClaimTestTokenHelpText />
        <div className="flex flex-row justify-between items-center">
          <AccountBalance />
          <ClaimTestToken />
        </div>
        <ViewTrxHelpText theAtom={claimTestTokenTrxIdAtom} />
      </div>

      <div className="bg-white shadow sm:rounded-lg flex flex-col gap-2.5 px-4 py-5 sm:p-6">
        <div className="py-4 px-2.5 bg-stone-50 rounded-sm border border-stone-200">
          <LightBulbIcon className="w-4 h-4 text-yellow-400 hidden sm:block sm:float-left mt-1.5" />
          <article className="prose prose-stone sm:ml-7 max-w-4xl prose-a:text-gray-500 overflow-x-scroll">
            <p>
              Our SDK allows you to sign transactions with your EVM compatible wallet and send them to the Substrate node. It will redirect any extrinsics to the <code>evm_account_mapping</code> pallet with minimal modifications.
            </p>
            <p>
              For example, instead of directly calling <code>.signAndSend</code> on the basic <code>apiPromise.tx.balances.transferAllowDeath</code>, you can use the <code>signAndSendEvm</code> helper function provided in the SDK:
            </p>
            <pre className="font-mono">{dedent`
              const result = await signAndSendEvm(
                apiPromise.tx.balances.transferAllowDeath(target_address, amount),
                apiPromise,
                walletClient,
                mappedAccount,
              )
            `}</pre>
            <p>You can claim test tokens above and test the transfer below.</p>
          </article>
        </div>
        <TransferToAddress />
        <ViewTrxHelpText theAtom={transferOutTrxIdAtom} />
      </div>
    </div>
  )
} 

import type { ApiPromise, SubmittableResult } from '@polkadot/api'
import type { ApiTypes, Signer as InjectedSigner } from '@polkadot/api/types'
import type { AddressOrPair, SubmittableExtrinsic } from '@polkadot/api-base/types/submittable'
import type { U256, U64 } from '@polkadot/types-codec'
import { hexToString, hexToU8a, u8aToHex } from '@polkadot/util'
import { blake2AsU8a, encodeAddress, secp256k1Compress } from '@polkadot/util-crypto'

import type { Account, Address, Hex, TestClient, WalletClient } from 'viem'
import { hashMessage, recoverPublicKey } from 'viem'
import type { signTypedData } from 'viem/wallet'
import { signMessage } from 'viem/wallet'


type SignTypedDataInput = Parameters<typeof signTypedData>[1]

/**
 * Get compressed formatted ether address for a specified account via a Wallet Client.
 */
export async function etherAddressToCompressedPubkey(
  client: WalletClient | TestClient,
  account: Account,
  msg = 'Allows to access the pubkey address.'
) {
  const sign = await signMessage(client, { account, message: msg })
  const hash = hashMessage(msg)
  const recovered = await recoverPublicKey({ hash, signature: sign })
  const compressedPubkey = u8aToHex(secp256k1Compress(hexToU8a(recovered)))
  return compressedPubkey
}

export interface EtherAddressToSubstrateAddressOptions {
  SS58Prefix?: number
  msg?: string
}

export interface Eip712Domain {
  name: string
  version: string
  chainId: number
  verifyingContract: Address
}

export function createEip712Domain(api: ApiPromise): Eip712Domain {
  try {
    const name = hexToString(api.consts.evmAccountMapping.eip712Name.toString())
    const version = hexToString(api.consts.evmAccountMapping.eip712Version.toString())
    const chainId = (api.consts.evmAccountMapping.eip712ChainID as U256).toNumber()
    const verifyingContract = api.consts.evmAccountMapping.eip712VerifyingContractAddress.toString() as Address
    return {
      name,
      version,
      chainId,
      verifyingContract,
    }
  } catch (_err) {
    throw new Error(
      'Create Eip712Domain object failed, possibly due to the unavailability of the evmAccountMapping pallet.'
    )
  }
}

export interface SubstrateCall {
  who: string
  callData: string
  nonce: number
}

export async function createSubstrateCall<T extends ApiTypes>(
  api: ApiPromise,
  substrateAddress: string,
  extrinsic: SubmittableExtrinsic<T>
) {
  const nonce = await api.query.evmAccountMapping.accountNonce<U64>(substrateAddress)
  return {
    who: substrateAddress,
    callData: extrinsic.inner.toHex(),
    nonce: nonce.toNumber(),
  }
}

/**
 * @params account Account  The viem WalletAccount instance for signging.
 * @params who string       The SS58 formated address of the account.
 * @params callData string  The encoded call data, usually create with `api.tx.foo.bar.inner.toHex()`
 * @params nonce number     The nonce of the account.
 */
export function createEip712StructedDataSubstrateCall(
  account: Account,
  domain: Eip712Domain,
  message: SubstrateCall
): SignTypedDataInput {
  return {
    account,
    types: {
      EIP712Domain: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'chainId',
          type: 'uint256',
        },
        {
          name: 'verifyingContract',
          type: 'address',
        },
      ],
      SubstrateCall: [
        { name: 'who', type: 'string' },
        { name: 'callData', type: 'bytes' },
        { name: 'nonce', type: 'uint64' },
      ],
    },
    primaryType: 'SubstrateCall',
    domain: domain,
    message: { ...message },
  }
}

export interface MappingAccount {
  evmAddress: Address
  compressedPubkey: Hex
  address: Address
}

export async function getMappingAccount(
  client: WalletClient,
  account: Account | { address: `0x${string}` },
  { SS58Prefix = 30, msg }: EtherAddressToSubstrateAddressOptions = {}
) {
  const compressedPubkey = await etherAddressToCompressedPubkey(client, account as Account, msg)
  const substratePubkey = encodeAddress(blake2AsU8a(hexToU8a(compressedPubkey)), SS58Prefix)
  return {
    evmAddress: account.address,
    compressedPubkey,
    address: substratePubkey,
  } as MappingAccount
}


export class SignAndSendError extends Error {
  readonly isCancelled: boolean = false
}

export function callback<TSubmittableResult>(
  resolve: (value: TSubmittableResult) => void,
  reject: (reason?: any) => void,
  result: SubmittableResult,
  unsub?: any
) {
  if (result.status.isInBlock) {
    let error
    for (const e of result.events) {
      const {
        event: { data, method, section },
      } = e
      if (section === 'system' && method === 'ExtrinsicFailed') {
        error = data[0]
      }
    }

    if (unsub) {
      ;(unsub as any)()
    }
    if (error) {
      reject(error)
    } else {
      resolve(result as TSubmittableResult)
    }
  } else if (result.status.isInvalid) {
    ;(unsub as any)()
    reject('Invalid transaction')
  }
}

export function signAndSend<TSubmittableResult extends SubmittableResult = SubmittableResult>(
  target: SubmittableExtrinsic<ApiTypes, TSubmittableResult>,
  pair: AddressOrPair
): Promise<TSubmittableResult>
export function signAndSend<TSubmittableResult extends SubmittableResult = SubmittableResult>(
  target: SubmittableExtrinsic<ApiTypes, TSubmittableResult>,
  address: AddressOrPair,
  signer: InjectedSigner
): Promise<TSubmittableResult>
export function signAndSend<TSubmittableResult extends SubmittableResult = SubmittableResult>(
  target: SubmittableExtrinsic<ApiTypes, TSubmittableResult>,
  address: AddressOrPair,
  signer?: InjectedSigner
) {
  // Ready -> Broadcast -> InBlock -> Finalized
  return new Promise(async (resolve, reject) => {
    try {
      if (signer) {
        const unsub = await target.signAndSend(address, { signer }, (result) => {
          callback<TSubmittableResult>(resolve, reject, result, unsub)
        })
      } else {
        const unsub = await target.signAndSend(address, (result) => {
          callback<TSubmittableResult>(resolve, reject, result, unsub)
        })
      }
    } catch (error) {
      const isCancelled = (error as Error).message.indexOf('Cancelled') !== -1
      Object.defineProperty(error, 'isCancelled', {
        enumerable: false,
        value: isCancelled,
      })
      reject(error as SignAndSendError)
    }
  })
}

export async function signAndSendEvm<TSubmittableResult extends SubmittableResult = SubmittableResult>(
  extrinsic: SubmittableExtrinsic<'promise'>,
  apiPromise: ApiPromise,
  client: WalletClient,
  account: MappingAccount,
): Promise<TSubmittableResult> {
  const substrateCall = await createSubstrateCall(apiPromise, account.address, extrinsic)
  const domain = createEip712Domain(apiPromise)
  const typedData = createEip712StructedDataSubstrateCall({ address: account.evmAddress } as Account, domain, substrateCall)
  const signature = await client.signTypedData(typedData)
  return await new Promise(async (resolve, reject) => {
    try {
      const _extrinsic = apiPromise.tx.evmAccountMapping.metaCall(
        account.address,
        substrateCall.callData,
        substrateCall.nonce,
        signature,
        null
      )
      return _extrinsic.send((result) => callback(resolve, reject, result))
    } catch (error) {
      const isCancelled = (error as Error).message.indexOf('Cancelled') !== -1
      Object.defineProperty(error, 'isCancelled', {
        enumerable: false,
        value: isCancelled,
      })
      reject(error)
    }
  })
}

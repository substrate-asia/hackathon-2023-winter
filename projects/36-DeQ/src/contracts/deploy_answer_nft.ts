import { createPublicClient, createWalletClient, http, getContractAddress, formatEther, defineChain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import arg from 'arg'
import fs from 'fs'

async function main() {
  const args = arg({
    '--rpc-url': String,
    '--private-key': String,
  })
  if (!args['--private-key']) {
    throw new Error('missing --private-key')
  }
  if (!args['--rpc-url']) {
    throw new Error('missing --rpc-url')
  }
  const rpcUrl = args['--rpc-url']
  console.log('RPC:', rpcUrl)

  const chain = defineChain({
    id: 595,
    name: 'Acala Mandala Testnet',
    network: 'acala',
    nativeCurrency: {
      decimals: 18,
      name: 'ACA',
      symbol: 'ACA',
    },
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
      public: {
        http: [rpcUrl],
      }
    }
  })

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  })
  const chainId = await publicClient.getChainId()

  const account = privateKeyToAccount(args['--private-key'] as `0x${string}`)
  const walletClient = createWalletClient({
    chain,
    transport: http(),
    account,
  })

  console.log('chainId:', chainId)
  console.log('deployer:', account.address)

  const balance = await publicClient.getBalance({ address: account.address })
  const tokens = formatEther(balance)
  console.log('balance:', tokens)

  const artifact = JSON.parse(fs.readFileSync('./out/AnswerNFT.sol/AnswerNFT.json', 'utf8'))
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode.object,
    args: [],
  })

  let ticks = 10
  let nonce: bigint | undefined = undefined
  while (ticks-- > 0) {
    try {
      const transaction = await publicClient.getTransaction({ hash })
      nonce = BigInt(transaction.nonce)
      break
    } catch (err) {
      console.log('waiting for transaction...')
      await new Promise((resolve) => setTimeout(resolve, 15_000))
    }
  }
  if (!nonce) {
    throw new Error('Deploy Failed.')
  }
  const transaction = await publicClient.getTransaction({ hash })
  console.log('transaction:', transaction)
  const contractAddress = getContractAddress({
    from: account.address,
    nonce,
  })
  console.log('contractAddress:', contractAddress)
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})

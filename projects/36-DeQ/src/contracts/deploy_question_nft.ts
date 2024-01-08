import { createPublicClient, createWalletClient, http, getContractAddress, formatEther, defineChain, getContract, parseUnits } from 'viem'
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

  const artifact = JSON.parse(fs.readFileSync('./out/QuestionNFT.sol/QuestionNFT.json', 'utf8'))
  const erc20_artifact = JSON.parse(fs.readFileSync('./out/IERC20.sol/IERC20.json', 'utf8'))

  // deploy contract
  // const hash = await walletClient.deployContract({
  //   abi: artifact.abi,
  //   bytecode: artifact.bytecode.object,
  //   args: [
  //     // LDOT
  //     '0x0000000000000000000100000000000000000003'
  //   ],
  // })
  // const nonce = await waitingTx(publicClient, hash)
  // if (!nonce) {
  //   throw new Error('Deploy Failed.')
  // }
  // const transaction = await publicClient.getTransaction({ hash })
  // console.log('transaction:', transaction)
  // const contractAddress = getContractAddress({
  //   from: account.address,
  //   nonce,
  // })

  const tokenAddress = '0x0000000000000000000100000000000000000003'
  const contractAddress = '0xC6C850C3455076da5726201a21593D537Ed58189'
  console.log('contractAddress:', contractAddress)

  // Step 1:
  // approve to transfer 1 LDOT
  const hash1 = await walletClient.writeContract({
    address: tokenAddress,
    abi: erc20_artifact.abi,
    functionName: 'approve',
    args: [contractAddress, parseUnits('1', 10)]
  })
  await waitingTx(publicClient, hash1)
  console.info(hash1)

  // Step 2:
  // createReward
  const hash2 = await walletClient.writeContract({
    address: contractAddress,
    abi: artifact.abi,
    functionName: 'createReward',
    // questionId is 1
    // deposit 1 LDOT
    args: [1, parseUnits('1', 10)]
  })
  await waitingTx(publicClient, hash2)
  console.info(hash2)

  // Step 3:
  // grantReward
  const hash3 = await walletClient.writeContract({
    address: contractAddress,
    abi: artifact.abi,
    functionName: 'grantReward',
    // questionId is 1
    // answerer is myself
    args: [1, account.address]
  })
  await waitingTx(publicClient, hash3)
  console.info(hash3)
}

async function waitingTx(publicClient, hash) {
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
  return nonce
}


main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})

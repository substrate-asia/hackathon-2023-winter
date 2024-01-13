import arg from 'arg'
import fs from 'fs'
import { createPublicClient, http, defineChain } from 'viem'

async function main() {
  const args = arg({
    '--rpc-url': String,
  })
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

  const artifact = JSON.parse(fs.readFileSync('./out/QuestionNFT.sol/QuestionNFT.json', 'utf8'))
  const contractAddress = '0xEbEE1C11166bB804D780B3827eCc8dd19fC3fB2E'
  const questionId = 1
  const data = await publicClient.readContract({
    address: contractAddress,
    abi: artifact.abi,
    functionName: 'tokenURI',
    args: [questionId]
  })

  console.info(`questionId ${questionId} tokenURI: ${data}`)
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})

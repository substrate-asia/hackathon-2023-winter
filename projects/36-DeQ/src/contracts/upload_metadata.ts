import arg from 'arg'
import fs from 'fs'
import Arweave from 'arweave'
import { ProxyAgent, setGlobalDispatcher } from 'undici'

if (process.env.http_proxy || process.env.https_proxy) {
  const proxyAgent = new ProxyAgent(process.env.http_proxy || process.env.https_proxy)
  setGlobalDispatcher(proxyAgent)
}

async function main() {
  const args = arg({
    '--key-file': String,
  })
  if (!args['--key-file']) {
    throw new Error('missing --key-file')
  }
  const arweave = Arweave.init({
    host: 'arweave.net',
    protocol: 'https',
    port: 443,
  })
  const wallet = JSON.parse(fs.readFileSync(args['--key-file'], { encoding: 'utf8' }))
  const metadata = {
    name: 'DeQ NFT #1',
    description: 'Question #1',
    externalURL: 'https://deq.lol/questions/view/1',
    attributes: [
      {
        trait_type: 'Title',
        value: 'What difference between Ordinals NFT and Traditional NFT.'
      },
      {
        trait_type: 'Body',
        value: 'The Bitcoin ecosystem has once again gained market attention.',
      },
      {
        trait_type: 'Reward',
        value: 0
      },
    ]
  }
  const tx = await arweave.createTransaction({ data: JSON.stringify(metadata) }, wallet)
  tx.addTag('Content-Type', 'application/json')
  await arweave.transactions.sign(tx, wallet)
  console.log('bundle tx: ', tx.id)
  let uploader = await arweave.transactions.getUploader(tx)
  while (!uploader.isComplete) {
    await uploader.uploadChunk()
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`)
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})

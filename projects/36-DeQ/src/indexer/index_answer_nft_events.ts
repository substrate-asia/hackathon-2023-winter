import { createPublicClient, http, defineChain, parseAbiItem, parseAbi } from 'viem'
import * as R from 'ramda'
import postgres from 'postgres'

const ANSWER_CONTRACT_ADDRESS = '0x3592D7BD047f069e17D708c31aa25d2c652323a2'

export const abis = [
  'function nextId() view returns (uint256)',
  'function create(address creator, uint256 questionId, string _uri) public',
  'function buy(uint256 id, uint256 amount) external payable',
  'function sell(uint256 id, uint256 amount) external',
  'event Created(uint256 indexed id, uint256 indexed questionId, address indexed creator, string uri)',
  'event Bought(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)',
  'event Sold(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)',
  'function CREATOR_PREMINT_SHARE() view returns (uint256)',
  //
  'function balanceOf(address owner, uint256 id) view returns (uint256)',
  //
  'function getBuyPrice(uint256 id, uint256 amount) view returns (uint256)',
  'function getSellPrice(uint256 id, uint256 amount) view returns (uint256)',
  'function getBuyPriceWithFee(uint256 id, uint256 amount) view returns (uint256)',
  'function getSellPriceWithFee(uint256 id, uint256 amount) view returns (uint256)',
] as const;

const mandala = defineChain({
  id: 595,
  name: 'Acala Mandala Testnet',
  network: 'acala',
  nativeCurrency: {
    decimals: 18,
    name: 'mACA',
    symbol: 'mACA',
  },
  rpcUrls: {
    default: {
      http: ['https://eth-rpc-tc9.aca-staging.network'],
    },
    public: {
      http: ['https://eth-rpc-tc9.aca-staging.network'],
    }
  }
})

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const sql = postgres(process.env.DATABASE_URL!);

//
//
//

const publicClient = createPublicClient({
  chain: mandala,
  transport: http(),
})

const created = await publicClient.getLogs({
  address: ANSWER_CONTRACT_ADDRESS,
  fromBlock: BigInt(1173150),
  event: parseAbiItem('event Created(uint256 indexed id, uint256 indexed questionId, address indexed creator, string uri)'),
})

const bought = await publicClient.getLogs({
  address: ANSWER_CONTRACT_ADDRESS,
  fromBlock: BigInt(1173150),
  event: parseAbiItem('event Bought(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)'),
})

const sold = await publicClient.getLogs({
  address: ANSWER_CONTRACT_ADDRESS,
  fromBlock: BigInt(1173150),
  event: parseAbiItem('event Sold(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)'),
})

console.log(`stats: created ${created.length}, bought ${bought.length}, sold ${sold.length}`)

//

const addresses = R.uniq([
  ...created.map(log => log.args.creator),
  ...bought.map(log => log.args.sender),
  ...sold.map(log => log.args.sender),
]) as string[]

const address_to_id = R.fromPairs((await sql`SELECT id, address FROM public.users WHERE address IN ${sql(addresses)} `).map((user: any) => [user.address, user.id]))

const token_ids: BigInt[] = []

const holders: [string, number, number][] = []

if (created.length > 0) {
  console.log('Processing CREATED events...')
  const created_exists = await sql` SELECT block_hash FROM trade_logs WHERE block_hash IN ${sql(R.uniq(created.map(log => log.blockHash)))} AND type = 'CREATED';`
  for (const log of created) {
    if (created_exists.find(exist => exist.block_hash === log.blockHash)) {
      console.log('skip', log.blockHash)
      continue
    }
    const { id, creator } = log.args
    const addr = creator as string
    try {
      await sql`
        INSERT INTO trade_logs (
          token_id, address, amount, tokens, creator_fee, block_hash, user_id, type
        )
        VALUES (${Number(id)}, ${addr}, ${1e18}, 0, 0, ${log.blockHash}, ${address_to_id[addr]}, 'CREATED');
      `
      holders.push([creator!, 1e18, Number(id)])
      token_ids.push(id!)
      console.log('indexed', log.blockHash)
    } catch (e) {
      console.log('Token Not Found: ', id)
    }
  }
}

if (bought.length > 0) {
  console.log('Processing BOUGHT events...')
  const bought_exists = await sql` SELECT block_hash FROM trade_logs WHERE block_hash IN ${sql(R.uniq(bought.map(log => log.blockHash)))} AND type = 'BOUGHT';`
  for (const log of bought) {
    if (bought_exists.find(exist => exist.block_hash === log.blockHash)) {
      console.log('skip', log.blockHash)  
      continue
    }
    const { id, sender, amount, price, fee } = log.args
    const addr = sender as string
    await sql`
      INSERT INTO trade_logs (
        token_id, address, amount, tokens, creator_fee, block_hash, user_id, type
      )
      VALUES (${Number(id)}, ${addr}, ${amount!.toString()}, ${price!.toString()}, ${fee!.toString()}, ${log.blockHash}, ${address_to_id[addr]}, 'BOUGHT');
    `
    holders.push([sender!, Number(amount!), Number(id)])
    token_ids.push(id!)
    console.log('indexed', log.blockHash)
  }
}

if (sold.length > 0) {
  console.log('Processing SOLD events...')
  const sold_exists = await sql` SELECT block_hash FROM trade_logs WHERE block_hash IN ${sql(R.uniq(sold.map(log => log.blockHash)))} AND type = 'SOLD';`
  for (const log of sold) {
    if (sold_exists.find(exist => exist.block_hash === log.blockHash)) {
      console.log('skip', log.blockHash)
      continue
    }
    const { id, sender, amount, price, fee } = log.args
    const addr = sender as string
    await sql`
      INSERT INTO trade_logs (
        token_id, address, amount, tokens, creator_fee, block_hash, user_id, type
      )
      VALUES (${Number(id)}, ${sender as string}, ${amount!.toString()}, ${price!.toString()}, ${fee!.toString()}, ${log.blockHash}, ${address_to_id[addr]}, 'SOLD');
    `
    holders.push([sender!, -Number(amount!), Number(id)])
    token_ids.push(id!)
    console.log('indexed', log.blockHash)
  }
}

if (holders.length > 0) {
  console.log('Update holders...')
  console.log(`founds: ${holders.length}`)

  for (const holder of holders) {
    const [address, amount, tokenId] = holder
    const user_id = address_to_id[address]
    if (!user_id) {
      console.log('skip with not matching user_id found: ', address)
      continue
    }
    await sql`
      INSERT INTO holders (token_id, shares, user_id) VALUES (${tokenId}, ${amount}, ${user_id})
      ON CONFLICT (token_id, user_id) DO UPDATE SET shares = holders.shares + ${amount};
    `
  }
}

if (token_ids.length > 0) {
  for (const token_id of R.uniq(token_ids)) {
    console.log('Update answers...', token_id.toString())

    const pricePerShare = await publicClient.readContract({
      address: ANSWER_CONTRACT_ADDRESS,
      abi: parseAbi(abis),
      functionName: 'getBuyPriceWithFee',
      args: [BigInt(token_id.toString()), BigInt(1e18)],
    })

    const [sharesCounter, valuesCounter] = await Promise.all([
      sql`
        SELECT SUM(shares) as shares FROM public.holders WHERE token_id = ${Number(token_id)}
      `,
      sql`
        SELECT type, SUM(tokens) as values FROM public.trade_logs WHERE token_id = ${Number(token_id)} GROUP BY type
      `,
    ])
    const bought = valuesCounter.find((counter) => counter.type === 'BOUGHT')
    const sold = valuesCounter.find((counter) => counter.type === 'SOLD')
    const values = (bought?.values || 0) - (sold?.values || 0)

    await sql`UPDATE public.answers SET price_per_share = ${pricePerShare.toString()}, shares = ${sharesCounter[0].shares}, values = ${values} WHERE token_id = ${Number(token_id)};`
  }
}

console.log('Completed.')

process.exit(0)
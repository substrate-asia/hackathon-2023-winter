import { it, beforeEach, beforeAll } from 'vitest'
import * as fs from 'node:fs'
import { createTestClient, http, publicActions, createWalletClient, walletActions, getContractAddress, getContract, parseAbi, type Address, type WalletClient, type PublicClient, type Transport, type TransactionExecutionError } from 'viem'
import { createAnvil } from "@viem/anvil";
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import { faker } from '@faker-js/faker'

const anvilTestPrivkeys: Readonly<`0x${string}`[]> = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
  "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
  "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
  "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
]

const testAccounts = anvilTestPrivkeys.map(privateKeyToAccount)

const abis = [
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
] as const

//
//
//

declare module 'vitest' {
  export interface TestContext {
    client: PublicClient<Transport, typeof foundry> & WalletClient<Transport, typeof foundry>
    address: Address
    deployer: ReturnType<typeof privateKeyToAccount>
  }
}

beforeAll(async () => {
  const anvil = createAnvil()
  await anvil.start()

  return async () => {
    await anvil.stop()
  }
})

beforeEach(async (ctx) => {
  const client = createTestClient({
    chain: foundry,
    mode: 'anvil',
    transport: http(),
  })
    .extend(publicActions)
    .extend(walletActions)

  await client.setAutomine(true)

  //
  // Deploy and get the contract address
  //
  const artifact = JSON.parse(fs.readFileSync('./out/AnswerNFT.sol/AnswerNFT.json', 'utf8'))
  const hash = await client.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode.object,
    account: testAccounts[0],
    args: [],
  })
  const transaction = await client.getTransaction({ hash })
  const contractAddress = getContractAddress({
    from: testAccounts[0].address,
    nonce: BigInt(transaction.nonce),
  })

  ctx.client = client
  ctx.deployer = testAccounts[0]
  ctx.address = contractAddress
})


//
//
//

it('Should increase nextId', async ({ expect, client, address }) => {
  const account = testAccounts[0]
  const contract = getContract({
    address,
    abi: parseAbi(abis),
    publicClient: client,
    walletClient: createWalletClient({
      chain: foundry,
      transport: http(),
      account,
    }),
  })
  const before = await contract.read.nextId()
  expect(before).toBe(BigInt(1))
  const arUri = `ar://${faker.string.uuid()}`
  await contract.write.create([account.address, BigInt(1), arUri])
  const after = await contract.read.nextId()
  expect(after).toBe(BigInt(2))

  const events = await contract.getEvents.Created()
  expect(events.length).toBe(1)

  const event = events[0]
  expect(event.args.id).toBe(BigInt(1))
  expect(event.args.questionId).toBe(BigInt(1))
  expect(event.args.creator).toBe(account.address)
  expect(event.args.uri).toBe(arUri)
})

it('Should emit Bought event & Sold event', async ({ expect, client, address }) => {
  const account = testAccounts[0]
  const contract = getContract({
    address,
    abi: parseAbi(abis),
    publicClient: client,
    walletClient: createWalletClient({
      chain: foundry,
      transport: http(),
      account,
    }),
  })
  const arUri = `ar://${faker.string.uuid()}`
  await contract.write.create([account.address, BigInt(0), arUri])

  const operator = testAccounts[1]

  const price = await contract.read.getBuyPrice([BigInt(1), BigInt(1e18)])
  const priceWithFee = await contract.read.getBuyPriceWithFee([BigInt(1), BigInt(1e18)])
  await contract.write.buy([BigInt(1), BigInt(1e18)], { account: operator, value: priceWithFee })
  const events = await contract.getEvents.Bought()
  expect(events.length).toBe(1)
  const event = events[0]
  expect(event.args.id).toBe(BigInt(1))
  expect(event.args.sender).toBe(operator.address)
  expect(event.args.amount).toBe(BigInt(1e18))
  expect(event.args.price).toBe(price)
  expect(event.args.fee).toBe(priceWithFee - price)

  const owns = await contract.read.balanceOf([operator.address, BigInt(1)])
  expect(owns).toBe(BigInt(1e18))

  const sellPrice = await contract.read.getSellPrice([BigInt(1), BigInt(1e18 / 2)])
  const sellPriceWithFee = await contract.read.getSellPriceWithFee([BigInt(1), BigInt(1e18 / 2)])
  await contract.write.sell([BigInt(1), BigInt(1e18 / 2)], { account: operator })
  const events2 = await contract.getEvents.Sold()
  expect(events2.length).toBe(1)
  const event2 = events2[0]
  expect(event2.args.id).toBe(BigInt(1))
  expect(event2.args.sender).toBe(operator.address)
  expect(event2.args.amount).toBe(BigInt(1e18 / 2))
  expect(event2.args.price).toBe(sellPrice)
  expect(event2.args.fee).toBe(sellPrice - sellPriceWithFee)

  const owns2 = await contract.read.balanceOf([operator.address, BigInt(1)])
  expect(owns2).toBe(BigInt(1e18 / 2))
})

it('Should raise price after the pool increase', async ({ expect, client, address }) => {
  const account = testAccounts[0]
  const contract = getContract({
    address,
    abi: parseAbi(abis),
    publicClient: client,
    walletClient: createWalletClient({
      chain: foundry,
      transport: http(),
      account,
    }),
  })
  const arUri = `ar://${faker.string.uuid()}`
  await contract.write.create([account.address, BigInt(0), arUri])

  const operator = testAccounts[1]

  const price = await contract.read.getBuyPrice([BigInt(1), BigInt(1e18)])
  const priceWithFee = await contract.read.getBuyPriceWithFee([BigInt(1), BigInt(1e18)])
  await contract.write.buy([BigInt(1), BigInt(1e18)], { account: operator, value: priceWithFee })
  const events = await contract.getEvents.Bought()
  expect(events.length).toBe(1)
  const event = events[0]
  expect(event.args.id).toBe(BigInt(1))
  expect(event.args.sender).toBe(operator.address)
  expect(event.args.amount).toBe(BigInt(1e18))
  expect(event.args.price).toBe(price)
  expect(event.args.fee).toBe(priceWithFee - price)

  const price2 = await contract.read.getBuyPrice([BigInt(1), BigInt(1e18)])
  const priceWithFee2 = await contract.read.getBuyPriceWithFee([BigInt(1), BigInt(1e18)])
  expect(price2).toBeGreaterThan(price)
  expect(priceWithFee2).toBeGreaterThan(priceWithFee)
})

it('Should not sold more than the CREATER_PREMINT', async ({ expect, client, address }) => {
  const account = testAccounts[0]
  const contract = getContract({
    address,
    abi: parseAbi(abis),
    publicClient: client,
    walletClient: createWalletClient({
      chain: foundry,
      transport: http(),
      account,
    }),
  })
  const creator_premint_share = await contract.read.CREATOR_PREMINT_SHARE()

  const arUri = `ar://${faker.string.uuid()}`
  await contract.write.create([account.address, BigInt(0), arUri])

  const operator = testAccounts[1]

  const priceWithFee = await contract.read.getBuyPriceWithFee([BigInt(1), BigInt(1e18)])
  await contract.write.buy([BigInt(1), BigInt(1e18)], { account: operator, value: priceWithFee })
  const events = await contract.getEvents.Bought()
  expect(events.length).toBe(1)

  const trxId = await contract.write.sell([BigInt(1), BigInt(creator_premint_share)])
  const events2 = await contract.getEvents.Sold()
  expect(events2.length).toBe(1)

  const transaction = await client.getTransaction({ hash: trxId })
  const blockNumber = transaction.blockNumber

  try {
    await contract.write.sell([BigInt(1), BigInt(1)], { account: operator })
  } catch (e) {
    expect((e as TransactionExecutionError).name).toBe('TransactionExecutionError')
  }
  const events3 = await client.getContractEvents({
    address,
    abi: parseAbi(abis),
    fromBlock: blockNumber + BigInt(1),
  })
  expect(events3.length).toBe(0)
})

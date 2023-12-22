import { parseAbi, type PublicClient, type WalletClient } from 'viem'

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

// Acala Testnet
export const ANSWER_CONTRACT_ADDRESS = '0x3592D7BD047f069e17D708c31aa25d2c652323a2'

// Polygon Mumbai Testnet
// export const ANSWER_CONTRACT_ADDRESS = '0xAa726b8EF06770d81F0110F7A10673839221f644'

export interface EstimatedPrice {
  price: bigint
  priceWithFee: bigint
  fee: bigint
  id: bigint
  amount: bigint
}

export async function getSellPrice(publicClient: PublicClient, id: bigint, amount: bigint) {
  const price = await publicClient.readContract({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'getSellPrice',
    args: [id, amount],
  })
  const priceWithFee = await publicClient.readContract({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'getSellPriceWithFee',
    args: [id, amount],
  })
  return {
    price: priceWithFee,
    priceWithFee: price,
    fee: price - priceWithFee,
    id,
    amount,
  } as const
}

export async function getBuyPrice(publicClient: PublicClient, id: bigint, amount: bigint) {
  const price = await publicClient.readContract({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'getBuyPrice',
    args: [id, amount],
  })
  const priceWithFee = await publicClient.readContract({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'getBuyPriceWithFee',
    args: [id, amount],
  })
  return {
    price: price,
    priceWithFee: priceWithFee,
    fee: priceWithFee - price,
    id,
    amount,
  } as const
}

export async function buy(publicClient: PublicClient, walletClient: WalletClient, id: bigint, amount: bigint) {
  const { priceWithFee } = await getBuyPrice(publicClient, id, amount)
  const { request } = await publicClient.simulateContract({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'buy',
    args: [BigInt(id), BigInt(amount)],
    value: priceWithFee,
  })
  const hash = await walletClient.writeContract(request)
  const transaction = await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 })
  if (transaction.status !== 'success') {
    throw new Error(`Transaction failed: ${transaction.status}`)
  }
  const events = await publicClient.getContractEvents({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    fromBlock: transaction.blockNumber,
    eventName: 'Bought',
  })
  return events
}

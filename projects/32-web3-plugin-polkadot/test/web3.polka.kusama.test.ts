import { Web3 } from 'web3';
import { PolkaPlugin } from '../src';

describe('test some RPC methods at web3.polka.kusama', () => {
  let web3: Web3;

  beforeAll(async () => {
    web3 = new Web3('wss://kusama-rpc.polkadot.io');
    web3.registerPlugin(new PolkaPlugin());
    web3.provider?.on('error', (error: any) => {
      console.log('Caught provider error: ', error.message || error);
    });
  });

  afterAll(() => {
    web3.provider?.disconnect();
  });

  it('should call chain.getBlock method', async () => {
    // const hash = "0x6277848db56df4936213f3c82d4b7181291674a9376deb22339dc504d33b8851";
    const response = await web3.polka.kusama.chain.getBlock(/*hash*/);
    expect(response).toBeDefined();
    expect(response.block).toBeDefined();
    expect(typeof response.block.header.stateRoot).toBe('string');

    // console.log(JSON.stringify(response, null, 2));
    // expect `response` to like:
    // {
    //   "block": {
    //     "header": {
    //       "parentHash": "0xc8c54972d1acd2a7a49a1e1f35e6e54552e1b44834e29b4f3fc19e0b8684fdd4",
    //       "number": "0xbac2",
    //       "stateRoot": "0xcfaee69365f6b8c6dbe4d292dee0f132c53e42a5c16d944448ad653b9afc7154",
    //       "extrinsicsRoot": "0xc0fa389ae8109dffe61ddd306afddd9035c34aba3a3c70c7f0a1a29c1c86b329",
    //       ...
    //     },
    //     ...
    //   },
    //   ...
    // }
  });

  it('should chain.getBlock() equals chain.getBlock(chain.getBlockHash(latestBlocHash))', async () => {
    const latestBlock = await web3.polka.kusama.chain.getBlock();
    const latestBlocHash = await web3.polka.kusama.chain.getBlockHash(latestBlock.block.header.number.toString());
    const blockByLatestBlocHash = await web3.polka.kusama.chain.getBlock(latestBlocHash);

    expect(blockByLatestBlocHash).toBeDefined();
    expect(blockByLatestBlocHash).toEqual(latestBlock);
  });

  it('should get the rpc methods', async () => {
    const response = await web3.polka.kusama.rpc.methods();

    expect(response).toBeDefined();

    expect(Array.isArray(response.methods)).toBe(true);
    expect(response.methods.length).toBeGreaterThan(0);

    // console.log(JSON.stringify(response.methods, null, 2));
  });
});

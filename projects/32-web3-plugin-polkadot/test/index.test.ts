import { Web3, core } from 'web3';
import { PolkadotPlugin } from '../src';
// import { BlockHash } from '@polkadot/types/interfaces';

describe('PolkadotPlugin Tests', () => {
  it('should register PolkadotPlugin plugin on Web3Context instance', () => {
    const web3Context = new core.Web3Context('ws://127.0.0.1:9944/');
    web3Context.registerPlugin(new PolkadotPlugin());
    expect(web3Context.polkadot).toBeDefined();
  });

  describe('PolkadotPlugin method tests', () => {
    let web3: Web3;
    // let blockHash: BlockHash;

    beforeAll(async () => {
      web3 = new Web3('http://127.0.0.1:9944/');
      web3.registerPlugin(new PolkadotPlugin());
    });

    afterAll(() => {});

    it('should call chain.getBlock method', async () => {
      // const hash = "0x6277848db56df4936213f3c82d4b7181291674a9376deb22339dc504d33b8851";
      const response = await web3.polkadot.chain.getBlock(/*hash*/);
      expect(response).toBeDefined();
      expect(response.block).toBeDefined();
      expect(typeof response.block.header.stateRoot).toBe('string');
      // console.log(JSON.stringify(blockByHash, null, 2));
      // expect `blockByHash` to like:
      // {
      //   "block": {
      //     "header": {
      //       "parentHash": "0xc8c54972d1acd2a7a49a1e1f35e6e54552e1b44834e29b4f3fc19e0b8684fdd4",
      //       "number": "0xbac2",
      //       "stateRoot": "0xcfaee69365f6b8c6dbe4d292dee0f132c53e42a5c16d944448ad653b9afc7154",
      //       "extrinsicsRoot": "0xc0fa389ae8109dffe61ddd306afddd9035c34aba3a3c70c7f0a1a29c1c86b329",
      //       "digest": {
      //         "logs": [
      //           "0x066175726120277aea1000000000",
      //           "0x05617572610101e01c8e2455868bd2032e85de6b2ab8d4ab786135e39d26322eb250356633577f3c8595042185612070f0ef69f0c540a96937ea435d3b86f20537eb863fb54e86"
      //         ]
      //       }
      //     },
      //     "extrinsics": [
      //       "0x280401000b10f28e778c01"
      //     ]
      //   },
      //   "justifications": null
      // }
    });

    it('should chain.getBlock() equals chain.getBlock(chain.getBlockHash(latestBlocHash))', async () => {
      const latestBlock = await web3.polkadot.chain.getBlock();
      const latestBlocHash = await web3.polkadot.chain.getBlockHash(latestBlock.block.header.number.toString());
      const blockByLatestBlocHash = await web3.polkadot.chain.getBlock(latestBlocHash);

      expect(blockByLatestBlocHash).toBeDefined();
      expect(blockByLatestBlocHash).toEqual(latestBlock);
    });
  });
});

import Web3, { core } from "web3";
import { PolkadotPlugin } from "../src";

describe("PolkadotPlugin Tests", () => {
  it("should register PolkadotPlugin plugin on Web3Context instance", () => {
    const web3Context = new core.Web3Context("ws://127.0.0.1:9944/");
    web3Context.registerPlugin(new PolkadotPlugin());
    expect(web3Context.polkadot).toBeDefined();
  });

  describe("PolkadotPlugin method tests", () => {

    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("http://127.0.0.1:9944/");
      web3.registerPlugin(new PolkadotPlugin());
    });

    afterAll(() => {
    });

    it("should call chain.getBlock method", async () => {
      const hash = "0x6277848db56df4936213f3c82d4b7181291674a9376deb22339dc504d33b8851";
      const response = await web3.polkadot.chain.getBlock(hash);
      // expect response to like:
      // {
      //   "jsonrpc": "2.0",
      //   "result": {
      //     "block": {
      //       "header": {
      //         "parentHash": "0x205d46cdcd9db4f795067718ef73292ab065aa08cec1ad6788b2c24028b160ea",
      //         "number": "0x6cc7",
      //         "stateRoot": "0xa18402bc3a2249d6af8e2ad6241e5b1b60360abd1b4e2c7c733c8c980331d278",
      //         "extrinsicsRoot": "0x345fc26b56a2a682a52ab5860b18df0a1698b0a6ac0cadd9bcba713d1a6f54d0",
      //         "digest": {
      //           "logs": [
      //             "0x0661757261203b5ee81000000000",
      //             "0x05617572610101187f7e10b05cd255b4ab0d3894b2c3c15bc4294a4124a7188981e3833af3440ae4322bec54ff65cb561e9fdfb4d02a5496fc64ea5991fcd4d42b43c48cd2588d"
      //           ]
      //         }
      //       },
      //       "extrinsics": [
      //         "0x280401000bd08620468c01"
      //       ]
      //     },
      //     "justifications": null
      //   },
      //   "id": 43
      // }
      expect(response).toBeDefined();
      expect(response.block).toBeDefined();
      expect(typeof response.block.header.stateRoot).toBe('string');

      
      console.log(JSON.stringify(response, null, 2));
    });
  });
});

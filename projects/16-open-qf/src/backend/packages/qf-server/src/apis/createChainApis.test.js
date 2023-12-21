const { getApis } = require("@osn/polkadot-api-container");
const { createChainApis } = require(".");
const { chains } = require("../consts");

jest.setTimeout(3000000);

describe("Apis", () => {
  const originalEnv = process.env;

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      COL_ENDPOINTS: "wss://polkadot-collectives-rpc.polkadot.io",
      DOT_ENDPOINTS:
        "wss://rpc.ibp.network/polkadot;wss://rpc-polkadot.luckyfriday.io",
    };
  });

  afterAll(async () => {
    process.env = originalEnv;
  });

  test("Create chain apis", async () => {
    await createChainApis();
    const apis = getApis(chains.collectives);
    expect(apis.length).toEqual(1);
  });
});

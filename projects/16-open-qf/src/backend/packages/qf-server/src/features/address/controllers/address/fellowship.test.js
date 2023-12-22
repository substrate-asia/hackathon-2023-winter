const { createChainApis } = require("../../../../apis");
const { getFellowshipRank } = require("./fellowship");

jest.setTimeout(3000000);

describe("Address", () => {
  const originalEnv = process.env;

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      COL_ENDPOINTS: "wss://polkadot-collectives-rpc.polkadot.io",
      DOT_ENDPOINTS:
        "wss://rpc.ibp.network/polkadot;wss://rpc-polkadot.luckyfriday.io",
    };

    await createChainApis();
  });

  afterAll(async () => {
    process.env = originalEnv;
  });

  test("address fellowship rank", async () => {
    const rank = await getFellowshipRank(
      "1363HWTPzDrzAQ6ChFiMU6mP4b6jmQid2ae55JQcKtZnpLGv"
    );
    expect(rank).toEqual(5);
  });
});

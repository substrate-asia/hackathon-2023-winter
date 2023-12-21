const {
  chain: { getApi }, test: { disconnect, setPolkadot },
} = require("@osn/scan-common");
const { queryReferendumInfo } = require("../referenda");

jest.setTimeout(3000000);

describe("Query", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("referenda referendum works", async () => {
    const api = await getApi();
    const blockHeight = 15978430;
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);

    const info = await queryReferendumInfo(0, blockHash);
    console.log(info);
    expect(info.ongoing.track).toEqual(30);
  });
});

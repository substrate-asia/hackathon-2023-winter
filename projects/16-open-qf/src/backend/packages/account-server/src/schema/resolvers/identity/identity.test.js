const {
  chain: { getApi, findBlockApi }, test: { disconnect, setPolkadot },
} = require("@osn/scan-common");
const { queryIdentityVerificationFromOneApi } = require("./index");

jest.setTimeout(3000000);

describe("Query", () => {
  beforeAll(async () => {
    await setPolkadot();
  });

  afterAll(async () => {
    await disconnect();
  });

  test("identity works", async () => {
    const api = await getApi();
    const blockHeight = 18551920;
    const blockHash = await api.rpc.chain.getBlockHash(blockHeight);
    const blockApi = await findBlockApi(blockHash);

    const isVerified = await queryIdentityVerificationFromOneApi(
      blockApi,
      "16SDAKg9N6kKAbhgDyxBXdHEwpwHUHs2CNEiLNGeZV55qHna" // Gav
    );
    expect(isVerified).toBeTruthy();
  });
})

const { getAddresses } = require("./generate");
const { randomIntFromInterval } = require("./utils");
const BigNumber = require("bignumber.js");
const { qf: { getContributorCol } } = require("@open-qf/mongo");

const decimals = 10;

const indexer = {
  blockHeight: 1,
  blockHash: "0xc0096358534ec8d21d01d34b836eed476a1c343f8724fa2153dc0725ad797a90",
  blockTime: 1590507378000,
  extrinsicIndex: 0,
  eventIndex: 0,
}

async function saveMockContributors() {
  const col = await getContributorCol();
  const bulk = col.initializeUnorderedBulkOp();

  const addresses = await getAddresses();
  for (const address of addresses) {
    const dot = randomIntFromInterval(1, 100);
    const balance = new BigNumber(dot).multipliedBy(Math.pow(10, decimals)).toNumber();
    const projectId = randomIntFromInterval(1, 12);
    const obj = {
      address,
      roundId: 1,
      projectId,
      balance,
      indexer,
      isMock: true,
    };
    bulk.insert(obj);
  }

  if (bulk.length > 0) {
    await bulk.execute();
  }
}

module.exports = {
  saveMockContributors,
}

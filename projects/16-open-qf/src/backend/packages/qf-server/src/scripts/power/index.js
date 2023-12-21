require("dotenv").config();

const { qf: { getContributorCol } } = require("@open-qf/mongo");
const { getTagsByAddress } = require("../../common");
const { createChainApis } = require("../../apis");

async function getContributors() {
  const col = await getContributorCol();
  return await col.find({ power: { $exists: false } }).limit(50).toArray();
}

async function saveAddressPower(address, bulk) {
  const tags = await getTagsByAddress(address);
  const power = tags.reduce((result, tag) => result + tag.power, 0);
  bulk.find({ address }).update({ $set: { power } });
}

async function savePowerForContributors(contributors = []) {
  const col = await getContributorCol();
  const bulk = col.initializeUnorderedBulkOp();
  for (const { address } of contributors) {
    await saveAddressPower(address, bulk);
  }

  if (bulk.length > 0) {
    await bulk.execute();
  }
  console.log(`Save power for ${ contributors.length } contributors`);
}

;(async () => {
  let contributors = await getContributors();
  if (contributors.length <= 0) {
    return;
  }

  await createChainApis();
  while (contributors.length > 0) {
    await savePowerForContributors(contributors);
    contributors = await getContributors();
  }

  process.exit(0);
})();

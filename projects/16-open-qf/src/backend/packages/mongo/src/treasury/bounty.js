const { getBountyBeneficiaryCol, getBountyCuratorCol } = require("./db");

async function insertBountyBeneficiary(address, indexer) {
  const col = await getBountyBeneficiaryCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return
  }

  await col.insertOne({ address, indexer });
}

async function insertBountyCurator(address, indexer) {
  const col = await getBountyCuratorCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return
  }

  await col.insertOne({ address, indexer });
}

module.exports = {
  insertBountyBeneficiary,
  insertBountyCurator,
}

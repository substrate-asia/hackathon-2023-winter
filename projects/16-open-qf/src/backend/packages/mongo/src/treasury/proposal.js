const { getProposalBeneficiaryCol } = require("./db");

async function insertProposalBeneficiary(address, indexer) {
  const col = await getProposalBeneficiaryCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return
  }

  await col.insertOne({ address, indexer });
}

module.exports = {
  insertProposalBeneficiary,
}

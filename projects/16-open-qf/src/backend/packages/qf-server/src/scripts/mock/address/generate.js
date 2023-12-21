const {
  treasury: { getProposalBeneficiaryCol, getBountyBeneficiaryCol, getTipBeneficiaryCol },
  governance: { getReferendaVoteCol },
} = require("@open-qf/mongo");

async function queryAddresses(col) {
  let records = await col.find({}, { projection: { _id: 0, indexer: 0 } }).toArray();
  return records.map(i => i.address);
}

async function getAddresses() {
  const proposalBeneficiaries = await queryAddresses(await getProposalBeneficiaryCol());
  const tipBeneficiaries = await queryAddresses(await getTipBeneficiaryCol());
  const bountyBeneficiaries = await queryAddresses(await getBountyBeneficiaryCol());
  const beneficiaries = new Set([
    ...proposalBeneficiaries,
    ...tipBeneficiaries,
    ...bountyBeneficiaries,
  ]);

  const voterCol = await getReferendaVoteCol();
  const voters = await voterCol.distinct("account");

  return [...new Set([...beneficiaries, ...voters])]
}

module.exports = {
  getAddresses,
}

require("dotenv").config();

const {
  treasury: { getProposalBeneficiaryCol, getBountyBeneficiaryCol, getTipBeneficiaryCol },
  governance: { getReferendaVoteCol, getReferendaReferendumCol },
} = require("@open-qf/mongo");

async function queryAddresses(col) {
  let records = await col.find({}, { projection: { _id: 0, indexer: 0 } }).toArray();
  return records.map(i => i.address);
}

(async () => {
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

  const all = [
    ...new Set([...beneficiaries, ...voters]),
  ]

  console.log(all);
})();

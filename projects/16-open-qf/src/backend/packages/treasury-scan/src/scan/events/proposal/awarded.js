const { treasury: { insertProposalBeneficiary } } = require("@open-qf/mongo");

async function handleTreasuryProposalAwarded(event, indexer) {
  const beneficiary = event.data[2].toString();
  await insertProposalBeneficiary(beneficiary, indexer);
}

module.exports = {
  handleTreasuryProposalAwarded,
}

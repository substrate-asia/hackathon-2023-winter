const { treasury: { insertBountyBeneficiary } } = require("@open-qf/mongo");

async function handleBountyClaimed(event, indexer) {
  const beneficiary = event.data[2].toString();
  await insertBountyBeneficiary(beneficiary, indexer);
}

module.exports = {
  handleBountyClaimed,
}

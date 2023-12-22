const { treasury: { insertBountyBeneficiary } } = require("@open-qf/mongo");

async function handleClaimedEvent(event, indexer) {
  const beneficiary = event.data[3].toString();
  await insertBountyBeneficiary(beneficiary, indexer);
}

module.exports = {
  handleClaimedEvent,
}

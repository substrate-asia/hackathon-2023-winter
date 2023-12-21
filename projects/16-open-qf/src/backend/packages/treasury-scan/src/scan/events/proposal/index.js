const { handleTreasuryProposalAwarded } = require("./awarded");

async function handleTreasuryProposalEvent(event, indexer) {
  const { section, method } = event;
  if ("treasury" !== section) {
    return
  }

  if ("Awarded" === method) {
    await handleTreasuryProposalAwarded(event, indexer);
  }
}

module.exports = {
  handleTreasuryProposalEvent,
}

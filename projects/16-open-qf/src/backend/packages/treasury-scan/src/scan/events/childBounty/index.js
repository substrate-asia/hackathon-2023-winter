const { handleClaimedEvent } = require("./claimed");

async function handleChildBountyEvent(event, indexer) {
  const { section, method } = event;
  if (!["childBounties"].includes(section)) {
    return;
  }

  if ("Claimed" === method) {
    await handleClaimedEvent(event, indexer);
  }
}

module.exports = {
  handleChildBountyEvent,
}

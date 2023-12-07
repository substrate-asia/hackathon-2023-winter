const { handleBountyClaimed } = require("./bountyClaimed");

async function handleBountyEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (!["bounties"].includes(section)) {
    return;
  }

  if ("BountyClaimed" === method) {
    await handleBountyClaimed(event, indexer);
  }
}

module.exports = {
  handleBountyEvent,
}

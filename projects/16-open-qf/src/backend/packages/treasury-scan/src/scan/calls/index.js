const { handleChildBountyAcceptCurator } = require("./childBounty/acceptCurator");
const { handleBountyAcceptCurator } = require("./bounty/acceptCurator");

async function handleCall(call, author, extrinsicIndexer, wrappedEvents) {
  await handleBountyAcceptCurator(call, author, extrinsicIndexer, wrappedEvents);
  await handleChildBountyAcceptCurator(call, author, extrinsicIndexer, wrappedEvents);
}

module.exports = {
  handleCall,
}

const { getBountyMeta } = require("../../../query/bountyMeta");
const { treasury: { insertBountyCurator } } = require("@open-qf/mongo");

async function handleBountyAcceptCurator(call, caller, extrinsicIndexer) {
  if (
    !["treasury", "bounties"].includes(call.section) ||
    "acceptCurator" !== call.method
  ) {
    return
  }

  const { bounty_id: bountyIndex } = call.toJSON().args;
  const meta = await getBountyMeta(extrinsicIndexer.blockHash, bountyIndex);
  if (!meta) {
    return
  }

  const { status: { active: { curator } = {}, pendingPayout: { curator: curator2 } = {} } = {} } = meta;
  if (curator || curator2) {
    await insertBountyCurator(curator || curator2, extrinsicIndexer);
  }
}

module.exports = {
  handleBountyAcceptCurator,
}

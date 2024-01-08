const { getChildBounty } = require("../../../query/childBounty");
const { treasury: { insertBountyCurator } } = require("@open-qf/mongo");

async function handleChildBountyAcceptCurator(call, author, indexer) {
  if (!["childBounties"].includes(call.section) || "acceptCurator" !== call.method) {
    return;
  }

  const parentBountyId = call.args[0].toNumber();
  const childBountyId = call.args[1].toNumber();
  const meta = await getChildBounty(parentBountyId, childBountyId, indexer);
  if (!meta) {
    return
  }
  const { status: { active: { curator } = {}, pendingPayout: { curator: curator2 } = {} } = {} } = meta;
  if (curator || curator2) {
    await insertBountyCurator(curator || curator2, indexer);
  }
}

module.exports = {
  handleChildBountyAcceptCurator,
}

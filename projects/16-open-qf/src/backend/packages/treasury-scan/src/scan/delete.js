const { treasury: { getTipCol } } = require("@open-qf/mongo");

async function cleanFrom(blockHeight) {
  const col = await getTipCol();
  await col.deleteMany({ height: { $gte: blockHeight } });
}

module.exports = {
  cleanFrom,
}

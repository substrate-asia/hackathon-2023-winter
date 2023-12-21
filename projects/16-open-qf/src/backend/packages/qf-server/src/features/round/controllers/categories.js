const {
  qf: { getProjectCol },
} = require("@open-qf/mongo");

async function getCategories(ctx) {
  const { id } = ctx.params;

  const col = await getProjectCol();
  ctx.body = await col.distinct("category", { roundId: parseInt(id) });
}

module.exports = {
  getCategories,
};

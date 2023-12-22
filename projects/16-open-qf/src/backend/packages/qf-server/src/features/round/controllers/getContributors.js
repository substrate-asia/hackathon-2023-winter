const {
  qf: { getContributorCol },
} = require("@open-qf/mongo");
const { extractPage } = require("../../../utils/extractPage");

async function getContributors(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { roundId, projectId } = ctx.params;
  const contributorCol = await getContributorCol();
  const q = {
    roundId: parseInt(roundId),
    projectId: parseInt(projectId),
  };
  const items = await contributorCol
    .find(q, { projection: { _id: 0 } })
    .sort({ id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  let total = await contributorCol.countDocuments(q);

  ctx.body = {
    items: items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getContributors,
}

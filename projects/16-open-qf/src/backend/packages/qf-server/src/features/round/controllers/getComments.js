const {
  qf: { getProjectCommentCol },
} = require("@open-qf/mongo");
const { extractPage } = require("../../../utils/extractPage");

async function getComments(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { roundId, projectId } = ctx.params;
  const q = { roundId: parseInt(roundId), projectId: parseInt(projectId) };

  const col = await getProjectCommentCol();
  const total = await col.countDocuments(q);
  const items = await col
    .find(q, { projection: { _id: 0 } })
    .sort({ id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  ctx.body = {
    items,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getComments,
};

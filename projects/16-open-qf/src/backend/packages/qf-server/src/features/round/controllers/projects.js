const { qf: { getProjectCol } } = require("@open-qf/mongo");
const { extractPage } = require("../../../utils/extractPage");
const { getProjectContributionInfo } = require("../../../common");

async function getRoundProjects(ctx) {
  const { page, pageSize } = extractPage(ctx);
  if (pageSize === 0 || page < 0) {
    ctx.status = 400;
    return;
  }

  const { id } = ctx.params;

  const col = await getProjectCol();
  const items = await col
    .find({ roundId: parseInt(id) }, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  let total = await col.estimatedDocumentCount();

  const projects = [];
  for (const item of items) {
    const { raised, contributorsCount } = await getProjectContributionInfo(item.id);
    projects.push({
      ...item,
      contributorsCount,
      raised,
    })
  }

  ctx.body = {
    items: projects,
    page,
    pageSize,
    total,
  };
}

module.exports = {
  getRoundProjects,
}

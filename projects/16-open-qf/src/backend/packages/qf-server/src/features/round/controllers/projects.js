const { qf: { getProjectCol, getContributorCol } } = require("@open-qf/mongo");
const { extractPage } = require("../../../utils/extractPage");
const { utils: { bigAdd } } = require("@osn/scan-common");

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
    .sort({ id: -1 })
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();
  let total = await col.estimatedDocumentCount();

  const contributorCol = await getContributorCol();
  const projects = [];
  for (const item of items) {
    const contributors = await contributorCol.find(
      { projectId: item.id },
      { projection: { _id: 0, address: 0, roundId: 0, projectId: 0, isMock: 0 } }
    ).toArray();
    const raised = contributors.reduce((result, contributor) => bigAdd(result, contributor.balance), 0);
    projects.push({
      ...item,
      contributorsCount: contributors.length,
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

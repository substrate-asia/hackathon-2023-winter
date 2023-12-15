const {
  qf: { getProjectCol, getContributorCol },
} = require("@open-qf/mongo");
require("bignumber.js");
const { utils: { bigAdd } } = require("@osn/scan-common");

async function getProject(ctx) {
  const { roundId, projectId } = ctx.params;

  const col = await getProjectCol();
  const q = { roundId: parseInt(roundId), id: parseInt(projectId) };
  const project = await col.findOne(q, { projection: { _id: 0 } });
  if (project) {
    const contributorCol = await getContributorCol();
    const contributors = await contributorCol.find(
      { roundId: parseInt(roundId), projectId: parseInt(projectId) },
      { projection: { _id: 0, address: 0, roundId: 0, projectId: 0, isMock: 0 } }
    ).toArray();
    const raised = contributors.reduce((result, contributor) => bigAdd(result, contributor.balance), 0);
    Object.assign(project, { contributorsCount: contributors.length, raised });
  }
  ctx.body = project;
}

module.exports = {
  getProject,
};

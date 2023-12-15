const {
  qf: { getProjectCol, getContributorCol },
} = require("@open-qf/mongo");

async function getProject(ctx) {
  const { roundId, projectId } = ctx.params;

  const col = await getProjectCol();
  const project = await col.findOne(
    { roundId: parseInt(roundId), id: parseInt(projectId) },
    { projection: { _id: 0 } }
  );
  if (project) {
    const contributorCol = await getContributorCol();
    const contributorsCount = await contributorCol.countDocuments({ projectId: project.id });
    Object.assign(project, { contributorsCount });
  }
  ctx.body = project;
}

module.exports = {
  getProject,
};

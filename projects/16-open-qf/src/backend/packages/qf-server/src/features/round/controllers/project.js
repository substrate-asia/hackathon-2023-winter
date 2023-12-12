const {
  qf: { getProjectCol },
} = require("@open-qf/mongo");

async function getProject(ctx) {
  const { roundId, projectId } = ctx.params;

  const col = await getProjectCol();
  ctx.body = await col.findOne(
    { roundId: parseInt(roundId), id: parseInt(projectId) },
    { projection: { _id: 0 } }
  );
}

module.exports = {
  getProject,
};

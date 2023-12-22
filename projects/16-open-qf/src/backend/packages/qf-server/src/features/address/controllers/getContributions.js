const { utils: { isValidAddress } } = require("@open-qf/common");
const {
  qf: { getContributorCol, getProjectCol },
} = require("@open-qf/mongo");

async function getAddressContributions(ctx) {
  const { address } = ctx.params;
  if (!isValidAddress(address)) {
    return [];
  }

  const contributorCol = await getContributorCol();
  const contributions = await contributorCol.find({ address }, { projection: { _id: 0 } }).toArray();

  const projectIds = [...new Set(contributions.map(item => item.projectId))];
  const projectCol = await getProjectCol();
  const projects = await projectCol.find({ id: { $in: projectIds } }).toArray();

  ctx.body = contributions.map(contribution => {
    const project = projects.find(p => p.id === contribution.projectId);
    return {
      ...contribution, project,
    }
  });
}

module.exports = {
  getAddressContributions,
}

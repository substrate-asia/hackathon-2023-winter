const { utils: { isValidAddress } } = require("@open-qf/common");
const {
  qf: { getProjectCol },
} = require("@open-qf/mongo");
const { getProjectContributionInfo } = require("../../../common");

async function getAddressProjects(ctx) {
  const { address } = ctx.params;
  if (!isValidAddress(address)) {
    return [];
  }

  const projectCol = await getProjectCol();
  const items = await projectCol.find({ creator: address }, { projection: { _id: 0 } }).toArray();

  const projects = [];
  for (const item of items) {
    const { raised, contributorsCount } = await getProjectContributionInfo(item.id);
    projects.push({
      ...item,
      contributorsCount,
      raised,
    })
  }

  ctx.body = projects;
}

module.exports = {
  getAddressProjects,
}

const {
  qf: { getContributorCol },
} = require("@open-qf/mongo");
const { utils: { bigAdd } } = require("@osn/scan-common");

async function getProjectContributionInfo(projectId) {
  const contributorCol = await getContributorCol();
  const contributors = await contributorCol.find(
    { projectId },
    { projection: { _id: 0, address: 0, roundId: 0, projectId: 0, isMock: 0 } }
  ).toArray();
  const raised = contributors.reduce((result, contributor) => bigAdd(result, contributor.balance), 0);

  return {
    raised,
    contributorsCount: contributors.length,
  };
}

module.exports = {
  getProjectContributionInfo,
}

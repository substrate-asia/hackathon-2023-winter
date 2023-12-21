const { getProjects } = require("./getProjects");
const { getContributors, calcSumByContributors } = require("./contributors");
const BigNumber = require("bignumber.js");
const {
  qf: { getRoundCol, getProjectCol }
} = require("@open-qf/mongo");

async function calcMatched() {
  const roundCol = await getRoundCol();
  const round = await roundCol.findOne({ id: 1 });
  const match = round.asset.amount;

  const projects = await getProjects();
  const projectIds = projects.map(p => p.id);
  const allContributors = await getContributors(projectIds);

  const projectSumMap = {};
  let sum = new BigNumber(0);
  for (const project of projects) {
    const contributors = allContributors.filter(c => c.projectId === project.id);
    const projectSum = calcSumByContributors(contributors);
    projectSumMap[project.id] = projectSum;
    sum = sum.plus(projectSum);
  }

  const projectCol = await getProjectCol();
  const bulk = projectCol.initializeUnorderedBulkOp();
  const divisor = new BigNumber(match).div(sum);
  for (const project of projects) {
    const projectSum = projectSumMap[project.id];
    const matched = new BigNumber(projectSum).multipliedBy(divisor).toFixed(0);
    bulk.find({ id: project.id }).update({ $set: { matched } });
  }

  if (bulk.length > 0) {
    await bulk.execute();
  }
}

module.exports = {
  calcMatched,
}

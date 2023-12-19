const {
  qf: { getContributorCol }
} = require("@open-qf/mongo");
const BigNumber = require("bignumber.js");

const decimals = 10;

async function getContributors(projectIds = []) {
  const contributorCol = await getContributorCol();
  return await contributorCol.find({ projectId: { $in: projectIds } }, {
    projection: {
      _id: 0, indexer: 0, address: 0,
    }
  }).toArray();
}

function calcSumByContributors(contributors = []) {
  let sqrtSum = new BigNumber(0);
  for (const contributor of contributors) {
    const { balance } = contributor;
    const sqrt = new BigNumber(balance).div(Math.pow(10, 10)).sqrt();
    // todo: add contributor power into calculation
    sqrtSum = sqrtSum.plus(sqrt)
  }

  return sqrtSum.pow(2).toNumber();
}

module.exports = {
  getContributors,
  calcSumByContributors,
}

const {
  qf: { getContributorCol }
} = require("@open-qf/mongo");
const BigNumber = require("bignumber.js");

async function getContributors(projectIds = []) {
  const contributorCol = await getContributorCol();
  return await contributorCol.find({ projectId: { $in: projectIds } }, {
    projection: {
      _id: 0, indexer: 0, address: 0,
    }
  }).toArray();
}

function getMultiplierFromPower(power = '0') {
  const normalizedPower = parseInt(power);
  if (!normalizedPower) {
    return 1;
  }

  return (100 + normalizedPower) / normalizedPower;
}

function calcSumByContributors(contributors = []) {
  let sqrtSum = new BigNumber(0);
  for (const contributor of contributors) {
    const { balance, power } = contributor;
    const sqrt = new BigNumber(balance).div(Math.pow(10, 10)).sqrt();
    const multiplier = getMultiplierFromPower(power);
    sqrtSum = sqrtSum.plus(sqrt * multiplier);
  }

  return sqrtSum.pow(2).toNumber();
}

module.exports = {
  getContributors,
  calcSumByContributors,
}

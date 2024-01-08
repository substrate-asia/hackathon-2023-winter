const {
  qf: { getProjectCol }
} = require("@open-qf/mongo");

async function getProjects() {
  const projectCol = await getProjectCol();
  return await projectCol.find({ roundId: 1 }, {
    projection: {
      _id: 0,
      links: 0,
      description: 0,
      bannerCid: 0,
      logoCid: 0,
      summary: 0,
      creator: 0,
      donationAddress: 0,
      category: 0,
    }
  }).toArray();
}

module.exports = {
  getProjects,
}

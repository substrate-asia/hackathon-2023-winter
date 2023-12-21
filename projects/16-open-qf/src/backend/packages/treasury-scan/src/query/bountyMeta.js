const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getBountyMeta(blockHash, bountyIndex) {
  const blockApi = await findBlockApi(blockHash);

  if (blockApi.query.treasury?.bounties) {
    return await blockApi.query.treasury?.bounties(bountyIndex);
  } else {
    return await blockApi.query.bounties.bounties(bountyIndex);
  }
}

module.exports = {
  getBountyMeta,
}

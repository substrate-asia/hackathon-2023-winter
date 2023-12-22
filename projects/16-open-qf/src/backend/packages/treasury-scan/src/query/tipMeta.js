const { chain: { findBlockApi } } = require("@osn/scan-common");

async function getTipMeta(blockHash, tipHash) {
  const blockApi = await findBlockApi(blockHash);

  if (blockApi.query.treasury?.tips) {
    return await blockApi.query.treasury?.tips(tipHash);
  } else {
    return await blockApi.query.tips.tips(tipHash);
  }
}

module.exports = {
  getTipMeta,
}

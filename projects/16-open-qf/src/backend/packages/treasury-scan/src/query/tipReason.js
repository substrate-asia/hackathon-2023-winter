const { chain: { findBlockApi } } = require("@osn/scan-common");
const { isHex, hexToString } = require("@polkadot/util");

async function getTipReason(blockHash, reasonHash) {
  const blockApi = await findBlockApi(blockHash);

  let rawMeta;
  if (blockApi.query.treasury?.reasons) {
    rawMeta = await blockApi.query.treasury?.reasons(reasonHash);
  } else {
    rawMeta = await blockApi.query.tips.reasons(reasonHash);
  }

  const maybeTxt = rawMeta.toHuman();
  if (isHex(maybeTxt)) {
    return hexToString(maybeTxt);
  } else {
    return maybeTxt;
  }
}

module.exports = {
  getTipReason,
}

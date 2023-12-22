const { account: { getAddressCol } } = require("@open-qf/mongo");
const { tags } = require("../../../../consts");

async function getAccountTag(address) {
  const col = await getAddressCol();
  const maybeAccount = await col.findOne({ address });
  if (!maybeAccount) {
    return null;
  }

  const { indexer: { blockTime } } = maybeAccount;
  const year = new Date(blockTime).getUTCFullYear();
  if (year < 2021) {
    return tags.find(tag => tag.id === "accountBefore2021");
  } else if (year < 2022) {
    return tags.find(tag => tag.id === "accountBefore2022");
  } else if (year < 2023) {
    return tags.find(tag => tag.id === "accountBefore2023");
  }

  return null;
}

module.exports = {
  getAccountTag,
}

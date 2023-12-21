const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { account: { getAddressCol } } = require("@open-qf/mongo");

async function initAccounts(indexer) {
  if (indexer.blockHeight > 1) {
    return;
  }

  const blockApi = await findBlockApi(indexer.blockHash);
  const entries = await blockApi.query.system.account.entries();
  const addresses = entries.map(([storageKey]) => storageKey.args[0].toString());

  const col = await getAddressCol();
  const bulk = col.initializeUnorderedBulkOp();
  for (const address of addresses) {
    bulk.insert({
      address,
      indexer,
    });
  }
  await bulk.execute();
}

module.exports = {
  initAccounts,
}

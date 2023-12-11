const { account: { getAddressCol } } = require("@open-qf/mongo");
const { getAddresses } = require("../store/address");

async function saveAccountCreated(address, indexer, bulk) {
  const col = await getAddressCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return;
  }

  bulk.insert({
    address,
    indexer,
  });
}

async function handleBlockAccounts(indexer) {
  const col = await getAddressCol();
  const bulk = col.initializeUnorderedBulkOp();
  const addresses = getAddresses(indexer.blockHeight);
  if (addresses.length <= 0) {
    return
  }

  const promises = [];
  for (const address of addresses) {
    const promise = saveAccountCreated(address, indexer, bulk);
    promises.push(promise);
  }

  await Promise.all(promises);
  if (bulk.length > 0) {
    await bulk.execute();
  }
}

module.exports = {
  handleBlockAccounts,
}

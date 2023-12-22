async function bulkSaveAccount(col, address, indexer, bulk) {
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return;
  }

  bulk.insert({
    address,
    indexer,
  });
}

module.exports = {
  bulkSaveAccount,
}

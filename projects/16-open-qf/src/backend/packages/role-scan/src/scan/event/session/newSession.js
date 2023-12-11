const { getValidators } = require("../../../query/session");
const {
  role: { getValidatorCol },
  common: { bulkSaveAccount },
} = require("@open-qf/mongo");

async function handleNewSession(event, indexer) {
  const { section, method } = event;
  if ("session" !== section || "NewSession" !== method) {
    return
  }

  const validators = await getValidators(indexer.blockHash);
  const col = await getValidatorCol();
  const bulk = col.initializeUnorderedBulkOp();
  let promises = [];
  for (const validator of validators) {
    const promise = await bulkSaveAccount(col, validator, indexer, bulk);
    promises.push(promise);
  }

  await Promise.all(promises);
  if (bulk.length > 0) {
    await bulk.execute();
  }
}

module.exports = {
  handleNewSession,
}

const {
  consts: { ElectionsPhragmenEvents, Modules },
  env: { currentChain }
} = require("@osn/scan-common");
const {
  role: { getCouncilorCol },
} = require("@open-qf/mongo");

async function saveAccountCreated(address, indexer, bulk) {
  const col = await getCouncilorCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return;
  }

  bulk.insert({
    address,
    indexer,
  });
}

function isElectionModule(section) {
  if ("centrifuge" === currentChain()) {
    return "elections" === section;
  }

  return [
    Modules.ElectionsPhragmen,
    Modules.PhragmenElection,
  ].includes(section)
}

async function handleElectionNewTerm(event, indexer) {
  const { section, method } = event;
  if (!isElectionModule(section) || ElectionsPhragmenEvents.NewTerm !== method) {
    return
  }

  const col = await getCouncilorCol();
  const bulk = col.initializeUnorderedBulkOp();
  let promises = [];
  for (const [account, balance] of event.data[0]) {
    const address = account.toString();
    const promise = saveAccountCreated(address, indexer, bulk);
    promises.push(promise);
  }
  await Promise.all(promises);
  await bulk.execute();
}

module.exports = {
  handleElectionNewTerm,
}

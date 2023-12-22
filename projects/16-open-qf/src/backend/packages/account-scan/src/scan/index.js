const {
  chain: { getBlockIndexer },
  scan: { oneStepScan },
  utils: { sleep },
} = require("@osn/scan-common");
const {
  account: { getAccountDb },
} = require("@open-qf/mongo");
const { addAddress, clearAddresses } = require("./store/address");
const { handleExtrinsics } = require("./extrinsic");
const { handleEvents } = require("./events");
const { handleBlockAccounts } = require("./account/update");
const { initAccounts } = require("./account/init");

async function handleBlock({ block, author, events, height }) {
  const blockIndexer = getBlockIndexer(block);

  if (author) {
    addAddress(height, author);
  }

  await handleExtrinsics(block.extrinsics, blockIndexer);
  await handleEvents(events, blockIndexer);

  await initAccounts(blockIndexer);
  await handleBlockAccounts(blockIndexer);

  const db = getAccountDb();
  await db.updateScanHeight(height);

  clearAddresses(blockIndexer.blockHeight);
}

async function scan() {
  const db = getAccountDb();
  let toScanHeight = await db.getNextScanHeight();

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    toScanHeight = await oneStepScan(toScanHeight, handleBlock);
    await sleep(1);
  }
}

module.exports = {
  handleBlock,
  scan,
};

const {
  treasury: { getTreasuryDb },
} = require("@open-qf/mongo");
const {
  chain: { getBlockIndexer },
  scan: { oneStepScan, handleExtrinsics, scanKnownHeights },
  utils: { sleep },
  env: { firstScanKnowHeights },
} = require("@osn/scan-common");
const { handleEvents } = require("./events");
const { handleCall } = require("./calls");
const { cleanFrom } = require("./delete");

async function handleBlock({ block, events, height }) {
  const blockIndexer = getBlockIndexer(block);

  await handleExtrinsics(block.extrinsics, events, blockIndexer, handleCall);
  await handleEvents(events, blockIndexer, block.extrinsics);

  const db = getTreasuryDb();
  await db.updateScanHeight(height);
}

async function scan() {
  const db = getTreasuryDb();
  let toScanHeight = await db.getNextScanHeight();
  await cleanFrom(toScanHeight);

  if (firstScanKnowHeights()) {
    await scanKnownHeights(
      toScanHeight,
      undefined,
      handleBlock,
    );
  }

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    toScanHeight = await oneStepScan(toScanHeight, handleBlock);
    await sleep(1);
  }
}

module.exports = {
  scan,
  handleBlock,
}

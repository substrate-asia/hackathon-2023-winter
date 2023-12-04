const {
  chain: { getBlockIndexer },
  scan: { oneStepScan },
  utils: { sleep },
} = require("@osn/scan-common");
const {
  councilor: { getCouncilorDb },
} = require("@open-qf/mongo");
const { handleEvents } = require("./event");

async function handleBlock({ block, events, height }) {
  const blockIndexer = getBlockIndexer(block);
  await handleEvents(events, block?.extrinsics, blockIndexer);

  const db = getCouncilorDb();
  await db.updateScanHeight(height);
}

async function scan() {
  const db = getCouncilorDb();
  let toScanHeight = await db.getNextScanHeight();

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

const {
  chain: { getBlockIndexer },
  scan: { oneStepScan },
  utils: { sleep },
} = require("@osn/scan-common");
const {
  account: { getAccountDb },
  qf: { getQfServerDb },
} = require("@open-qf/mongo");
const { handleEvents } = require("./events");

async function handleBlock({ block, events, height }) {
  const blockIndexer = getBlockIndexer(block);
  await handleEvents(events, blockIndexer);

  const db = getAccountDb();
  await db.updateScanHeight(height);
}

async function scan() {
  const db = getQfServerDb();
  let toScanHeight = await db.getNextScanHeight();

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    toScanHeight = await oneStepScan(toScanHeight, handleBlock);
    await sleep(1);
  }
}

module.exports = {
  scan,
}

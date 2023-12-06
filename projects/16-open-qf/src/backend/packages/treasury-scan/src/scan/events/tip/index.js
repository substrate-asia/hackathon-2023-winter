const { handleNewTip } = require("./newTip");
const { handleTipClosed } = require("./tipClosed");

async function handleTreasuryTipEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (!["treasury", "tips"].includes(section)) {
    return;
  }

  if ("NewTip" === method) {
    await handleNewTip(event, indexer, extrinsic, blockEvents)
  } else if ("TipClosed" === method) {
    await handleTipClosed(event, indexer, extrinsic, blockEvents);
  } else if ("TipRetracted" === method) {
  } else if ("TipSlashed" === method) {
  }
}

module.exports = {
  handleTreasuryTipEvent,
}

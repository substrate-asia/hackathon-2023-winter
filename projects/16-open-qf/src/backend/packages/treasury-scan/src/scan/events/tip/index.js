const { handleNewTip } = require("./newTip");
const { handleTipClosed } = require("./tipClosed");
const { handleTipRetracted } = require("./tipRetracted");
const { handleTipSlashed } = require("./tipSlashed");

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
    await handleTipRetracted(event);
  } else if ("TipSlashed" === method) {
    await handleTipSlashed(event);
  }
}

module.exports = {
  handleTreasuryTipEvent,
}

const { treasury: { updateTip } } = require("@open-qf/mongo");

async function handleTipSlashed(event) {
  const hash = event.data[0].toString();
  await updateTip(hash, { isFinal: true, state: "Slashed" });
}

module.exports = {
  handleTipSlashed,
}

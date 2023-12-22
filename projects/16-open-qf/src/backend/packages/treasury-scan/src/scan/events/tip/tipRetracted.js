const { treasury: { updateTip } } = require("@open-qf/mongo");

async function handleTipRetracted(event) {
  const hash = event.data[0].toString();
  await updateTip(hash, { isFinal: true, state: "Retracted" });
}

module.exports = {
  handleTipRetracted,
}

const { addAddress } = require("../../store/address");

async function handleCommonEvent(event, indexer) {
  const { data = [] } = event;
  for (const arg of data) {
    if (!arg.toString) {
      continue;
    }

    const argStr = arg.toString();
    addAddress(indexer.blockHeight, argStr);
  }
}

module.exports = {
  handleCommonEvent,
};

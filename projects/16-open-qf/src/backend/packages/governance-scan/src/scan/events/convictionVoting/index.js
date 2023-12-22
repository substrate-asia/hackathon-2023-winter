const { setConvictionDelegationMark } = require("../../../store");

async function handleConvictionVotingEvents(event, indexer) {
  const { section, method } = event;
  if (section !== "convictionVoting") {
    return false;
  }

  if (["Delegated", "Undelegated"].includes(method)) {
    setConvictionDelegationMark(indexer.blockHeight);
  }
}

module.exports = {
  handleConvictionVotingEvents,
}

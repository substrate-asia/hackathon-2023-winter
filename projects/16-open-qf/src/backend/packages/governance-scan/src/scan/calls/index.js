const { handleConvictionVotingCalls } = require("./convictionVoting");

async function handleCalls(call, author, extrinsicIndexer, wrappedEvents) {
  await handleConvictionVotingCalls(call, author, extrinsicIndexer, wrappedEvents);
}

module.exports = {
  handleCalls,
}

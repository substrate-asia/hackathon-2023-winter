const { handleConvictionVotingRemoveVote } = require("./removeVote");
const { handleConvictionVotingVote } = require("./vote");
const {
  logger,
} = require("@osn/scan-common");

async function handleConvictionVotingCalls(call, author, extrinsicIndexer, wrappedEvents) {
  try {
    await handleConvictionVotingVote(call, author, extrinsicIndexer, wrappedEvents);
    await handleConvictionVotingRemoveVote(call, author, extrinsicIndexer, wrappedEvents);
  } catch (e) {
    logger.error(`Handle conviction voting call error at ${ extrinsicIndexer.blockHeight }`, e);
  }
}

module.exports = {
  handleConvictionVotingCalls,
}

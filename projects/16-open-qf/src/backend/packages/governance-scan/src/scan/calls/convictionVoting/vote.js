const { addConvictionVoteHeight } = require("../../../store");

async function handleConvictionVotingVote(call, author, extrinsicIndexer) {
  const { section, method, args } = call;
  if ("convictionVoting" !== section || "vote" !== method) {
    return
  }

  const referendumIndex = args[0].toNumber();
  addConvictionVoteHeight(extrinsicIndexer.blockHeight, referendumIndex);
}

module.exports = {
  handleConvictionVotingVote,
}

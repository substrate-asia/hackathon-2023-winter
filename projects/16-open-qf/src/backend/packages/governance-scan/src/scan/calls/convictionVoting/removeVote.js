const { addConvictionVoteHeight } = require("../../../store");

async function handleConvictionVotingRemoveVote(call, author, extrinsicIndexer) {
  const { section, method, args } = call;
  if ("convictionVoting" !== section || "removeVote" !== method) {
    return
  }

  const referendumIndex = args[1].toNumber();
  addConvictionVoteHeight(extrinsicIndexer.blockHeight, referendumIndex);
}

module.exports = {
  handleConvictionVotingRemoveVote,
}

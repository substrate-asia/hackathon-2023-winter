const { getReferendaVoteCol } = require("./db");

async function bulkInsertReferendaVotes(referendumIndex, votes = []) {
  if (votes.length <= 0) {
    return
  }

  const col = await getReferendaVoteCol();
  const bulk = col.initializeOrderedBulkOp();
  await bulk.find({ referendumIndex }).delete();
  for (const vote of votes) {
    bulk.insert(vote);
  }
  await bulk.execute();
}

module.exports = {
  bulkInsertReferendaVotes,
}

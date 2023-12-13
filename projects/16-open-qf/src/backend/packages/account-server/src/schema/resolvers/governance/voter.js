const {
  governance: {
    getReferendaReferendumCol, getReferendaVoteCol,
  },
} = require("@open-qf/mongo");

const toQueryReferendaCount = 100;

async function queryIsActiveVoter(address) {
  const referendumCol = await getReferendaReferendumCol();
  const querySettings = { projection: { index: 1, _id: 0 } };
  const activeReferenda = await referendumCol.find({ isFinal: false }, querySettings).toArray();
  const ids = activeReferenda.map(r => r.index);

  const voteCol = await getReferendaVoteCol();
  if (ids.length > 0) {
    const votes = await voteCol.find({
      account: address, referendumIndex: { $in: ids },
    }).toArray();
    if (votes.length > 0) {
      return true;
    }
  }

  if (activeReferenda.length >= toQueryReferendaCount) {
    return false;
  }

  const toQueryFinalCount = toQueryReferendaCount - activeReferenda.length;
  const finalReferenda = await referendumCol
    .find({ isFinal: true })
    .sort({ index: -1 })
    .limit(toQueryFinalCount)
    .toArray();
  const finalIds = finalReferenda.map(r => r.index);

  const votesOfFinalReferenda = await voteCol.find({
    account: address, referendumIndex: { $in: finalIds },
  }).toArray();
  return votesOfFinalReferenda.length > 0;
}

module.exports = {
  queryIsActiveVoter,
}

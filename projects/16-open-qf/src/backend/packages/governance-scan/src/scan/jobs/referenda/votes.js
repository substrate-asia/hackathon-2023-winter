const {
  chain: { getLatestHeight, getApi },
} = require("@osn/scan-common");
const { hasConvictionDelegationMark } = require("../../../store/blockConvictionDelegation");
const { getVotedReferenda } = require("../../../store/convictionVote");
const { governance: { getUnFinalReferenda, bulkInsertReferendaVotes } } = require("@open-qf/mongo");
const {
  extractReferendaVotes,
  extractReferendaDelegations,
  normalizeVotingOfEntry,
} = require("../../../common");

async function updateVotesForOneReferendum(mappedVotes, trackId, referendumIndex) {
  const directVotes = extractReferendaVotes(mappedVotes, referendumIndex);
  const delegationVotes = extractReferendaDelegations(mappedVotes, trackId, directVotes);
  const allVotes = [...directVotes, ...delegationVotes].map(vote => ({ referendumIndex, ...vote }));

  await bulkInsertReferendaVotes(referendumIndex, allVotes);
}

async function updateUnFinalReferendaVotes(indexer) {
  const chainHeight = getLatestHeight();
  if (indexer.blockHeight < chainHeight - 50) {
    return
  }

  let referenda;
  if (
    hasConvictionDelegationMark(indexer.blockHeight) ||
    getVotedReferenda(indexer.blockHeight) ||
    indexer.blockHeight % 100 === 0
  ) {
    referenda = await getUnFinalReferenda();
  }

  const api = await getApi();
  if (!api.query.convictionVoting?.votingFor) {
    return
  }

  const entries = await api.query.convictionVoting.votingFor.entries();
  const mapped = entries.map((item) => normalizeVotingOfEntry(item));
  for (const { index, trackId } of referenda) {
    await updateVotesForOneReferendum(mapped, trackId, index);
  }
}

module.exports = {
  updateUnFinalReferendaVotes,
}

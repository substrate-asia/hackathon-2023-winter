const {
  governance: {
    updateReferendaReferendum,
    getReferendaReferendum,
    bulkInsertReferendaVotes,
  }
} = require("@open-qf/mongo");
const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const {
  normalizeVotingOfEntry,
  extractReferendaVotes,
  extractReferendaDelegations,
} = require("../../../common");

async function handleReferendaVoteFinished(event, indexer) {
  const referendumIndex = event.data[0].toNumber();
  await updateReferendaReferendum(referendumIndex, { isFinal: true });

  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query.convictionVoting?.votingFor) {
    return
  }

  const referendum = await getReferendaReferendum(referendumIndex);
  if (!referendum) {
    throw new Error(`Can not find referenda referendum from DB at ${ indexer.blockHeight }`);
  }

  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item));
  const directVotes = extractReferendaVotes(mapped, referendumIndex);
  const delegationVotes = extractReferendaDelegations(mapped, referendum.trackId, directVotes);
  const allVotes = [...directVotes, ...delegationVotes].map(vote => ({ referendumIndex, ...vote }));

  await bulkInsertReferendaVotes(referendumIndex, allVotes);
}

module.exports = {
  handleReferendaVoteFinished,
}

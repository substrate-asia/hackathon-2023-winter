const { calcVotes } = require("../utils");

function extractReferendaDelegations(mapped, track, directVotes = []) {
  const delegations = mapped
    .filter(({ trackId, voting }) => voting.isDelegating && trackId === track)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  return delegations.reduce((result, { account, delegating: { balance, conviction, target } }) => {
    const to = directVotes.find(({ account, isStandard }) => account === target.toString() && isStandard);
    if (!to) {
      return result;
    }

    return [
      ...result,
      {
        account,
        target: target.toString(),
        balance: balance.toBigInt().toString(),
        isDelegating: true,
        isStandard: false,
        isSplit: false,
        isSplitAbstain: false,
        aye: to.aye,
        conviction: conviction.toNumber(),
        votes: calcVotes(balance.toBigInt().toString(), conviction.toNumber()),
      },
    ];
  }, []);
}

module.exports = {
  extractReferendaDelegations,
}

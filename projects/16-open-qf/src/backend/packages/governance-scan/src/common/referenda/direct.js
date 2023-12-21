const { calcVotes } = require("../utils");

function extractStandardVote(account, vote) {
  const standard = vote.asStandard;
  const balance = standard.balance.toBigInt().toString();
  const conviction = standard.vote.conviction.toNumber();

  return {
    account,
    isDelegating: false,
    isStandard: true,
    isSplit: false,
    isAbstain: false,
    balance,
    aye: standard.vote.isAye,
    conviction: standard.vote.conviction.toNumber(),
    votes: calcVotes(balance, conviction),
  };
}

function extractSplitVote(account, vote) {
  const split = vote.asSplit;
  const ayeBalance = split.aye.toBigInt().toString();
  const nayBalance = split.nay.toBigInt().toString();

  return {
    account,
    isDelegating: false,
    isStandard: false,
    isSplit: true,
    isAbstain: false,
    ayeBalance,
    nayBalance,
    conviction: 0,
  }
}

function extractSplitAbstainVote(account, vote) {
  const splitAbstain = vote.asSplitAbstain;
  const ayeBalance = splitAbstain.aye.toBigInt().toString();
  const nayBalance = splitAbstain.nay.toBigInt().toString();
  const abstainBalance = splitAbstain.abstain.toBigInt().toString();
  return {
    account,
    isDelegating: false,
    isStandard: false,
    isSplit: false,
    isSplitAbstain: true,
    ayeBalance,
    nayBalance,
    abstainBalance,
    conviction: 0,
  };
}

function extractReferendaVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isCasting)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asCasting.votes.filter(([idx]) =>
          idx.eq(targetReferendumIndex),
        ),
      };
    })
    .filter(({ votes }) => votes.length > 0)
    .map(({ account, votes }) => {
      return {
        account,
        vote: votes[0][1],
      };
    })
    .reduce((result, { account, vote }) => {
      if (vote.isStandard) {
        result.push(extractStandardVote(account, vote));
      } else if (vote.isSplit) {
        result.push(extractSplitVote(account, vote));
      } else if (vote.isSplitAbstain) {
        result.push(extractSplitAbstainVote(account, vote));
      }

      return result;
    }, []);
}

module.exports = {
  extractReferendaVotes,
}

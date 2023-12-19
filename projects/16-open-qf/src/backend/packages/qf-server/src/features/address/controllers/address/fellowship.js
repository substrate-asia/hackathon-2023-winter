const { chains } = require("../../../../consts");
const { checkAndGetApis, queryFromApis } = require("../../../../common");

async function getFellowshipRankFromOneApi(api, address) {
  if (!api.query.fellowshipCollective?.members) {
    return null;
  }

  const member = await api.query.fellowshipCollective.members(address);
  if (!member.isSome) {
    return null;
  }

  const unwrapped = member.unwrap();
  return unwrapped.rank.toNumber();
}

async function getFellowshipRank(address) {
  const apis = checkAndGetApis(chains.collectives);
  return await queryFromApis(apis, getFellowshipRankFromOneApi, [address]);
}

module.exports = {
  getFellowshipRank,
};

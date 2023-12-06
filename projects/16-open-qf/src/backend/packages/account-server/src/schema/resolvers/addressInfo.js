const {
  treasury: { getTipFinderCol, getTipBeneficiaryCol }
} = require("@open-qf/mongo");
const { utils: { isValidAddress } } = require("@open-qf/common");
const { checkAndGetApis } = require("@open-qf/node-api/src/common/checkAndGetApis");
const { chains } = require("../../consts");
const { queryFromApis } = require("@open-qf/node-api/src/common/queryFromApis");

const fellowshipRankDefault = {
  fellowshipRank1: false,
  fellowshipRank2: false,
  fellowshipRank3: false,
  fellowshipRank4: false,
  fellowshipRank5: false,
  fellowshipRank6: false,
}

async function getMemberFromOneApi(api, address) {
  if (!api.query.fellowshipCollective?.members) {
    return null;
  }

  const member = await api.query.fellowshipCollective.members(address);
  if (!member.isSome) {
    return fellowshipRankDefault;
  }

  const unwrapped = member.unwrap();
  const rank = unwrapped.rank.toNumber();
  if (1 === rank) {
    return {
      ...fellowshipRankDefault,
      fellowshipRank1: true,
    }
  } else if (2 === rank) {
    return {
      ...fellowshipRankDefault,
      fellowshipRank2: true,
    }
  } else if (3 === rank) {
    return {
      ...fellowshipRankDefault,
      fellowshipRank3: true,
    }
  } else if (4 === rank) {
    return {
      ...fellowshipRankDefault,
      fellowshipRank4: true,
    }
  } else if (5 === rank) {
    return {
      ...fellowshipRankDefault,
      fellowshipRank5: true,
    }
  } else if (6 === rank) {
    return {
      ...fellowshipRankDefault,
      fellowshipRank6: true,
    }
  }

  return fellowshipRankDefault;
}

async function addressInfo(_, _args) {
  const { address } = _args;
  if (!isValidAddress(address)) {
    return { isTipFinder: false, isTipBeneficiary: false, ...fellowshipRankDefault };
  }

  const finderCol = await getTipFinderCol();
  const maybeInDbFinder = await finderCol.findOne({ address });

  const beneficiaryCol = await getTipBeneficiaryCol();
  const maybeInDbBeneficiary = await beneficiaryCol.findOne({ address });

  const apis = checkAndGetApis(chains.collectives);
  const fellowship = await queryFromApis(apis, getMemberFromOneApi, [address]);

  return { isTipFinder: !!maybeInDbFinder, isTipBeneficiary: !!maybeInDbBeneficiary, ...fellowship };
}

module.exports = {
  addressInfo,
}

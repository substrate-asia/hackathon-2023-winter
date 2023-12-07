const {
  treasury: {
    getTipFinderCol,
    getTipBeneficiaryCol,
    getProposalBeneficiaryCol,
    getBountyBeneficiaryCol,
    getBountyCuratorCol,
  }
} = require("@open-qf/mongo");
const { utils: { isValidAddress } } = require("@open-qf/common");
const { chains } = require("../../consts");
const { checkAndGetApis } = require("../../common/checkAndGetApis");
const { queryFromApis } = require("../../common/queryFromApis");

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

async function isInDb(col, address) {
  const maybeInDb = await col.findOne({ address });
  return !!maybeInDb;
}

async function addressInfo(_, _args) {
  const { address } = _args;
  if (!isValidAddress(address)) {
    return { isTipFinder: false, isTipBeneficiary: false, ...fellowshipRankDefault };
  }

  const isTipFinder = await isInDb(await getTipFinderCol(), address);
  const isTipBeneficiary = await isInDb(await getTipBeneficiaryCol(), address);
  const isProposalBeneficiary = await isInDb(await getProposalBeneficiaryCol(), address);
  const isBountyBeneficiary = await isInDb(await getBountyBeneficiaryCol(), address);
  const isBountyCurator = await isInDb(await getBountyCuratorCol(), address);

  const apis = checkAndGetApis(chains.collectives);
  const fellowship = await queryFromApis(apis, getMemberFromOneApi, [address]);

  return {
    isTipFinder,
    isTipBeneficiary,
    isProposalBeneficiary,
    isBountyBeneficiary,
    isBountyCurator,
    ...fellowship,
  };
}

module.exports = {
  addressInfo,
}

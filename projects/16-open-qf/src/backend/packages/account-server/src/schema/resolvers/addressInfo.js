const {
  treasury: {
    getTipFinderCol,
    getTipBeneficiaryCol,
    getProposalBeneficiaryCol,
    getBountyBeneficiaryCol,
    getBountyCuratorCol,
  },
  role: {
    getValidatorCol,
  }
} = require("@open-qf/mongo");
const { utils: { isValidAddress } } = require("@open-qf/common");
const { chains } = require("../../consts");
const { checkAndGetApis } = require("../../common/checkAndGetApis");
const { queryFromApis } = require("../../common/queryFromApis");
const { queryIdentityVerificationFromOneApi } = require("./identity/query");

async function getMemberFromOneApi(api, address) {
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

async function isInDb(col, address) {
  const maybeInDb = await col.findOne({ address });
  return !!maybeInDb;
}

async function addressInfo(_, _args) {
  const { address } = _args;
  if (!isValidAddress(address)) {
    return {
      isTipFinder: false,
      isTipBeneficiary: false,
      isProposalBeneficiary: false,
      isBountyBeneficiary: false,
      isBountyCurator: false,
      fellowshipRank: null,
    };
  }

  const isTipFinder = await isInDb(await getTipFinderCol(), address);
  const isTipBeneficiary = await isInDb(await getTipBeneficiaryCol(), address);
  const isProposalBeneficiary = await isInDb(await getProposalBeneficiaryCol(), address);
  const isBountyBeneficiary = await isInDb(await getBountyBeneficiaryCol(), address);
  const isBountyCurator = await isInDb(await getBountyCuratorCol(), address);
  const isValidator = await isInDb(await getValidatorCol(), address);

  const apis = checkAndGetApis(chains.collectives);
  const fellowshipRank = await queryFromApis(apis, getMemberFromOneApi, [address]);
  const polkadotApis = checkAndGetApis(chains.polkadot);
  const hasVerifiedIdentity = await queryFromApis(polkadotApis, queryIdentityVerificationFromOneApi, [address]);

  return {
    isTipFinder,
    isTipBeneficiary,
    isProposalBeneficiary,
    isBountyBeneficiary,
    isBountyCurator,
    fellowshipRank,
    isValidator,
    hasVerifiedIdentity,
  };
}

module.exports = {
  addressInfo,
}

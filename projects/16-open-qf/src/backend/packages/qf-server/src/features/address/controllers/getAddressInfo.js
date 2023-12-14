const { getFellowshipRank } = require("./address/fellowship");
const { checkIsIdentityVerified } = require("./address/identity");
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
const { isInDb } = require("./utils");
const { utils: { isValidAddress } } = require("@open-qf/common");
const { queryIsActiveVoter } = require("./address/voter");

async function getAddressInfo(ctx) {
  const { address } = ctx.params;
  if (!isValidAddress(address)) {
    return {
      fellowshipRank: null,
      hasVerifiedIdentity: false,
      isTipFinder: false,
      isTipBeneficiary: false,
      isProposalBeneficiary: false,
      isBountyBeneficiary: false,
      isBountyCurator: false,
      isValidator: false,
      isActiveVoter: false,
    };
  }

  const fellowshipRank = await getFellowshipRank(address);
  const hasVerifiedIdentity = await checkIsIdentityVerified(address);

  const isTipFinder = await isInDb(await getTipFinderCol(), address);
  const isTipBeneficiary = await isInDb(await getTipBeneficiaryCol(), address);
  const isProposalBeneficiary = await isInDb(await getProposalBeneficiaryCol(), address);
  const isBountyBeneficiary = await isInDb(await getBountyBeneficiaryCol(), address);
  const isBountyCurator = await isInDb(await getBountyCuratorCol(), address);
  const isValidator = await isInDb(await getValidatorCol(), address);
  const isActiveVoter = await queryIsActiveVoter(address);

  ctx.body = {
    fellowshipRank,
    hasVerifiedIdentity,
    isTipFinder,
    isTipBeneficiary,
    isProposalBeneficiary,
    isBountyBeneficiary,
    isBountyCurator,
    isValidator,
    isActiveVoter,
  }
}

module.exports = {
  getAddressInfo,
}

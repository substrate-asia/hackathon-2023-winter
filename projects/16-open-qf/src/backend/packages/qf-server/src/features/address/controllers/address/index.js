const { getFellowshipRank } = require("./fellowship");
const { isInDb } = require("../utils");
const { queryIsActiveVoter } = require("./voter");
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
const { checkIsIdentityVerified } = require("../../../../common");

async function queryAddressInfo(address) {
  const fellowshipRank = await getFellowshipRank(address);
  const hasVerifiedIdentity = await checkIsIdentityVerified(address);

  const isTipFinder = await isInDb(await getTipFinderCol(), address);
  const isTipBeneficiary = await isInDb(await getTipBeneficiaryCol(), address);
  const isProposalBeneficiary = await isInDb(await getProposalBeneficiaryCol(), address);
  const isBountyBeneficiary = await isInDb(await getBountyBeneficiaryCol(), address);
  const isBountyCurator = await isInDb(await getBountyCuratorCol(), address);
  const isValidator = await isInDb(await getValidatorCol(), address);
  const isActiveVoter = await queryIsActiveVoter(address);

  return {
    fellowshipRank,
    hasVerifiedIdentity,
    isTipFinder,
    isTipBeneficiary,
    isProposalBeneficiary,
    isBountyBeneficiary,
    isBountyCurator,
    isValidator,
    isActiveVoter,
  };
}

module.exports = {
  queryAddressInfo,
}

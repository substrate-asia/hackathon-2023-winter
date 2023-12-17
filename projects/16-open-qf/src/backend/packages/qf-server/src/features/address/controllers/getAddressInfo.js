const { utils: { isValidAddress } } = require("@open-qf/common");
const { queryAddressInfo } = require("./address");

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

  ctx.body = await queryAddressInfo(address);
}

module.exports = {
  getAddressInfo,
}

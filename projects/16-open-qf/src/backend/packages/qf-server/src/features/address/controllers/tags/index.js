const { utils: { isValidAddress } } = require("@open-qf/common");
const { getFellowshipRankTag } = require("./fellowship");
const { checkIsIdentityVerified } = require("../address/identity");
const { isInDb } = require("../utils");
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
const { queryIsActiveVoter } = require("../address/voter");
const { tags } = require("../../../../consts");
const { getAccountTag } = require("./account");

async function getAddressTags(ctx) {
  const { address } = ctx.params;
  if (!isValidAddress(address)) {
    return [];
  }

  const candidateTags = [
    await getAccountTag(address),
    await getFellowshipRankTag(address),
  ];
  const hasVerifiedIdentity = await checkIsIdentityVerified(address);
  if (hasVerifiedIdentity) {
    candidateTags.push(tags.find(tag => tag.id === "hasVerifiedIdentity"));
  }
  if (await isInDb(await getTipFinderCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isTipFinder"));
  }
  if (await isInDb(await getTipBeneficiaryCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isTipBeneficiary"));
  }
  if (await isInDb(await getProposalBeneficiaryCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isProposalBeneficiary"));
  }
  if (await isInDb(await getBountyBeneficiaryCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isBountyBeneficiary"));
  }
  if (await isInDb(await getBountyCuratorCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isBountyCurator"));
  }
  if (await isInDb(await getValidatorCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isValidator"));
  }
  if (await queryIsActiveVoter(address)) {
    candidateTags.push(tags.find(tag => tag.id === "isActiveVoter"));
  }

  ctx.body = candidateTags.filter(Boolean);
  // todo: 2. account debug tag
}

module.exports = {
  getAddressTags,
}

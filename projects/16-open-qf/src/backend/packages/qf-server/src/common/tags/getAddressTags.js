const { getAccountTag } = require("../../features/address/controllers/tags/account");
const { getFellowshipRankTag } = require("../../features/address/controllers/tags/fellowship");
const { tags } = require("../../consts");
const { queryIsActiveVoter } = require("../../features/address/controllers/address/voter");
const { checkIsIdentityVerified } = require("./identity");
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
const { isInDb } = require("./isInDb");

async function getTagsByAddress(address) {
  const candidateTags = [
    await getAccountTag(address),
    await getFellowshipRankTag(address),
  ];

  if (await isInDb(await getTipFinderCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isTipFinder"));
  }
  if (await isInDb(await getTipBeneficiaryCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isTipBeneficiary"));
  }
  if (await isInDb(await getProposalBeneficiaryCol(), address)) {
    candidateTags.push(tags.find(tag => tag.id === "isProposalBeneficiary"));
  }
  if (await checkIsIdentityVerified(address)) {
    candidateTags.push(tags.find(tag => tag.id === "hasVerifiedIdentity"));
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

  return candidateTags.filter(Boolean);
}

module.exports = {
  getTagsByAddress,
}

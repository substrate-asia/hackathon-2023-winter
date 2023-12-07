const addressInfo = /* GraphQL */ `
  type AddressInfo {
    isTipFinder: Boolean!
    isTipBeneficiary: Boolean!
    isProposalBeneficiary: Boolean!
    isBountyBeneficiary: Boolean!
    isBountyCurator: Boolean!
    fellowshipRank1: Boolean!
    fellowshipRank2: Boolean!
    fellowshipRank3: Boolean!
    fellowshipRank4: Boolean!
    fellowshipRank5: Boolean!
    fellowshipRank6: Boolean!
  }
`;

module.exports = {
  addressInfo,
}

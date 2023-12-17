const tags = [
  {
    id: "accountBefore2021",
    name: "Account Before 2021",
    description: "Account debut before 2021(UTC time)",
    power: 6,
  },
  {
    id: "accountBefore2022",
    name: "Account Before 2022",
    description: "Account debut before 2022(UTC time)",
    power: 4,
  },
  {
    id: "accountBefore2023",
    name: "Account Before 2023",
    description: "Account debut before 2023(UTC time)",
    power: 2,
  },
  {
    id: "fellowshipRank6",
    name: "Fellowship Rank 6",
    description: "A fellowship member whose rank is >= 6",
    power: 20,
  },
  {
    id: "fellowshipRank5",
    name: "Fellowship Rank 5",
    description: "A fellowship member whose rank is 5",
    power: 16,
  },
  {
    id: "fellowshipRank4",
    name: "Fellowship Rank 4",
    description: "A fellowship member whose rank is 4",
    power: 12,
  },
  {
    id: "fellowshipRank3",
    name: "Fellowship Rank 3",
    description: "A fellowship member whose rank is 3",
    power: 8,
  },
  {
    id: "fellowshipRank2",
    name: "Fellowship Rank 2",
    description: "A fellowship member whose rank is 2",
    power: 2,
  },
  {
    id: "fellowshipRank1",
    name: "Fellowship Rank 1",
    description: "A fellowship member whose rank is 1",
    power: 1,
  },
  {
    id: "hasVerifiedIdentity",
    name: "Identity Verified",
    description: "Has a on chain verified identity, sub identity not included",
    power: 10,
  },
  {
    id: "isTipFinder",
    name: "Tip Finder",
    description: "Gov1 tip finder who proposed a tip and got awarded value which is > 0",
    power: 4,
  },
  {
    id: "isTipBeneficiary",
    name: "Tip Beneficiary",
    description: "Gov1 tip beneficiary who got awarded value which is > 0",
    power: 6,
  },
  {
    id: "isProposalBeneficiary",
    name: "Proposal Beneficiary",
    description: "Treasury proposal beneficiary who got awarded value which is > 0",
    power: 10,
  },
  {
    id: "isBountyCurator",
    name: "Bounty Curator",
    description: "Be or once to be a bounty curator",
    power: 8,
  },
  {
    id: "isBountyBeneficiary",
    name: "Bounty Beneficiary",
    description: "Bounty or child bounty beneficiary",
    power: 10,
  },
  {
    id: "isValidator",
    name: "Validator",
    description: "Be or once to be a validator",
    power: 10,
  },
  {
    id: "isActiveVoter",
    name: "Active Voter",
    description: "Vote latest 100 OpenGov proposals",
    power: 10,
  },
];

module.exports = {
  tags,
}

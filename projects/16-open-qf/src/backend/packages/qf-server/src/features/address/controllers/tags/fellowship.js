const { getFellowshipRank } = require("../address/fellowship");
const isNil = require("lodash.isnil");
const { tags } = require("../../../../consts");

async function getFellowshipRankTag(address) {
  const fellowshipRank = await getFellowshipRank(address);
  if (isNil(fellowshipRank)) {
    return null;
  }

  if (fellowshipRank >= 6) {
    return tags.find(tag => tag.id === "fellowshipRank6");
  } else if (5 === fellowshipRank) {
    return tags.find(tag => tag.id === "fellowshipRank5");
  } else if (4 === fellowshipRank) {
    return tags.find(tag => tag.id === "fellowshipRank4");
  } else if (3 === fellowshipRank) {
    return tags.find(tag => tag.id === "fellowshipRank3");
  } else if (2 === fellowshipRank) {
    return tags.find(tag => tag.id === "fellowshipRank2");
  } else if (1 === fellowshipRank) {
    return tags.find(tag => tag.id === "fellowshipRank1");
  }

  throw new Error(`Unknown fellowship rank ${ fellowshipRank }`);
}

module.exports = {
  getFellowshipRankTag,
}

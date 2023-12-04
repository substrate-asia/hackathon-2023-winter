const { utils: { isValidAddress } } = require("@open-qf/common");
const { checkAndGetApis } = require("../../common/checkAndGetApis");
const { queryFromApis } = require("../../common/queryFromApis");

async function getMemberFromOneApi(api, address) {
  if (!api.query.fellowshipCollective?.members) {
    return null;
  }

  return await api.query.fellowshipCollective.members(address);
}

async function getFellowshipMember(ctx) {
  const { chain, address } = ctx.params;
  if (!isValidAddress(address)) {
    ctx.body = null;
    return
  }

  const apis = checkAndGetApis(chain);
  try {
    ctx.body = await queryFromApis(apis, getMemberFromOneApi, [address]);
  } catch (e) {
    console.error("Get balance from node fail", e);
    ctx.throw(500, "Failed to query balance from node");
  }
}

module.exports = {
  getFellowshipMember,
}

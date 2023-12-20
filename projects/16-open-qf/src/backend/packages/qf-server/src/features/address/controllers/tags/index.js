const {
  utils: { isValidAddress },
} = require("@open-qf/common");
const { getTagsByAddress } = require("../../../../common");

async function getAddressTags(ctx) {
  const { address } = ctx.params;
  if (!isValidAddress(address)) {
    return [];
  }

  ctx.body = await getTagsByAddress(address);
}

module.exports = {
  getAddressTags,
};

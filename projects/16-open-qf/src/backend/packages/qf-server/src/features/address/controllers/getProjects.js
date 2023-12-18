const { utils: { isValidAddress } } = require("@open-qf/common");
const {
  qf: { getProjectCol },
} = require("@open-qf/mongo");

async function getAddressProjects(ctx) {
  const { address } = ctx.params;
  if (!isValidAddress(address)) {
    return [];
  }

  const projectCol = await getProjectCol();
  ctx.body = await projectCol.find({ creator: address }, { projection: { _id: 0 } }).toArray();
}

module.exports = {
  getAddressProjects,
}

const { qf: { getRoundCol } } = require("@open-qf/mongo");
const { HttpError } = require("../../../utils/httpError");

async function getRound(ctx) {
  const { id } = ctx.params;

  const col = await getRoundCol();
  const round = await col.findOne({ id: parseInt(id) }, { projection: { _id: 0 } });
  if (!round) {
    throw new HttpError(404, "round not found");
  }

  ctx.body = round;
}

module.exports = {
  getRound,
}

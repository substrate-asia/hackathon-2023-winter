const { qf: { getRoundCol, getContributorCol } } = require("@open-qf/mongo");
const { HttpError } = require("../../../utils/httpError");

async function getRound(ctx) {
  const { id } = ctx.params;

  const col = await getRoundCol();
  const round = await col.findOne({ id: parseInt(id) }, { projection: { _id: 0 } });
  if (!round) {
    throw new HttpError(404, "round not found");
  }

  const contributorCol = await getContributorCol();
  const contributorsCount = await contributorCol.countDocuments({ roundId: round.id });

  ctx.body = {
    ...round,
    contributorsCount,
  };
}

module.exports = {
  getRound,
}

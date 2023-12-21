const { getRoundCol } = require("./db");

async function insertRound(round = {}) {
  const { id } = round || {};
  const col = await getRoundCol();
  const maybeInDb = await col.findOne({ id });
  if (maybeInDb) {
    throw new Error(`Round #${ id } has already exist in DB`);
  }

  await col.insertOne(round);
}

module.exports = {
  insertRound,
}

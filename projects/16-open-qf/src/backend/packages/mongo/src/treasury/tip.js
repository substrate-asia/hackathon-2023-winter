const isEmpty = require("lodash.isempty");
const { getTipCol, getTipBeneficiaryCol, getTipFinderCol } = require("./db");

async function insertTreasuryTip(obj) {
  const { hash, height } = obj;
  const col = await getTipCol();
  const maybeInDb = await col.findOne({ hash, height });
  if (maybeInDb) {
    throw new Error(`Treasury hash ${ hash } on height ${ height } is already in DB`);
  }

  await col.insertOne(obj);
}

async function insertTipBeneficiary(address, indexer) {
  const col = await getTipBeneficiaryCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return
  }

  await col.insertOne({ address, indexer });
}

async function insertTipFinder(address, indexer) {
  const col = await getTipFinderCol();
  const maybeInDb = await col.findOne({ address });
  if (maybeInDb) {
    return
  }

  await col.insertOne({ address, indexer });
}

async function updateTip(hash, updates = {}) {
  if (isEmpty(updates)) {
    return
  }

  const col = await getTipCol();
  await col.updateOne({ hash, isFinal: false }, { $set: updates });
}

async function findUnFinishedTip(hash) {
  const col = await getTipCol();
  return col.findOne({ hash, isFinal: false });
}

module.exports = {
  insertTreasuryTip,
  insertTipBeneficiary,
  insertTipFinder,
  updateTip,
  findUnFinishedTip,
}

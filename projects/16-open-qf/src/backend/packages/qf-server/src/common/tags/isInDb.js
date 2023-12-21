async function isInDb(col, address) {
  const maybeInDb = await col.findOne({ address });
  return !!maybeInDb;
}

module.exports = {
  isInDb,
}

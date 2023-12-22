const { getProjectCol } = require("./db");

async function insertProject(project = {}) {
  const { id } = project || {};
  const col = await getProjectCol();
  const maybeInDb = await col.findOne({ id });
  if (maybeInDb) {
    throw new Error(`Project #${ id } has already exist in DB`);
  }

  await col.insertOne(project);
}

module.exports = {
  insertProject,
}

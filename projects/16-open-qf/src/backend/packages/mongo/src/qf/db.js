const {
  mongo: { ScanDb }, env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;

let roundCol = null;
let projectCol = null;

async function initQfServerDb() {
  db = new ScanDb(getEnvOrThrow("MONGO_QF_SERVER_URL"), getEnvOrThrow("MONGO_QF_SERVER_NAME"),);
  await db.init();

  roundCol = await db.createCol("round");
  projectCol = await db.createCol("project");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }
}

async function makeSureInit(col) {
  if (!col) {
    await initQfServerDb();
  }
}

async function getRoundCol() {
  await makeSureInit(roundCol);
  return roundCol;
}

async function getProjectCol() {
  await makeSureInit(projectCol);
  return projectCol;
}

function getQfServerDb() {
  return db;
}

module.exports = {
  getQfServerDb,
  getRoundCol,
  getProjectCol,
}

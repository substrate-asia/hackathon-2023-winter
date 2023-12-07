const {
  mongo: { ScanDb }, env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;

let roundCol = null;

async function initQfServerDb() {
  db = new ScanDb(getEnvOrThrow("MONGO_QF_SERVER_URL"), getEnvOrThrow("MONGO_QF_SERVER_NAME"),);
  await db.init();

  roundCol = await db.createCol("round");
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

function getQfServerDb() {
  return db;
}

module.exports = {
  getQfServerDb,
  getRoundCol,
}

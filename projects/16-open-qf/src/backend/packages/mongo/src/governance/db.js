const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let referendaReferendumCol = null;
let referendaVoteCol = null;

async function initGovernanceScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_GOV_SCAN_URL"),
    getEnvOrThrow("MONGO_GOV_SCAN_NAME"),
  );
  await db.init();

  referendaReferendumCol = await db.createCol("referendaReferendum");
  referendaVoteCol = await db.createCol("referendaVote");

  await _createIndexes();
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await referendaVoteCol.createIndex({ index: 1 });
  await referendaVoteCol.createIndex({ account: 1 });
}

async function makeSureInit(col) {
  if (!col) {
    await initGovernanceScanDb();
  }
}

async function getReferendaReferendumCol() {
  await makeSureInit(referendaReferendumCol);
  return referendaReferendumCol;
}

async function getReferendaVoteCol() {
  await makeSureInit(referendaVoteCol);
  return referendaVoteCol;
}

function getGovernanceDb() {
  return db;
}

module.exports = {
  initGovernanceScanDb,
  getGovernanceDb,
  getReferendaReferendumCol,
  getReferendaVoteCol,
}

const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let tipCol = null;
let tipBeneficiaryCol = null;
let tipFinderCol = null;
let proposalBeneficiaryCol = null;
let bountyBeneficiaryCol = null;
let bountyCuratorCol = null;

async function initTreasuryScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_TREASURY_SCAN_URL"),
    getEnvOrThrow("MONGO_TREASURY_SCAN_NAME"),
  );
  await db.init();

  tipCol = await db.createCol("tip");
  tipBeneficiaryCol = await db.createCol("tipBeneficiary");
  tipFinderCol = await db.createCol("tipFinder");
  proposalBeneficiaryCol = await db.createCol("proposalBeneficiary");
  bountyBeneficiaryCol = await db.createCol("bountyBeneficiary");
  bountyCuratorCol = await db.createCol("bountyCurator");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await tipBeneficiaryCol.createIndex({ address: 1 }, { unique: true });
  await tipFinderCol.createIndex({ address: 1 }, { unique: true });
  await proposalBeneficiaryCol.createIndex({ address: 1 }, { unique: true });
  // TODO: create indexes for better query performance
}

async function makeSureInit(col) {
  if (!col) {
    await initTreasuryScanDb();
  }
}

async function getTipCol() {
  await makeSureInit(tipCol);
  return tipCol;
}

async function getTipBeneficiaryCol() {
  await makeSureInit(tipBeneficiaryCol);
  return tipBeneficiaryCol;
}

async function getTipFinderCol() {
  await makeSureInit(tipFinderCol);
  return tipFinderCol;
}

async function getProposalBeneficiaryCol() {
  await makeSureInit(proposalBeneficiaryCol);
  return proposalBeneficiaryCol;
}

async function getBountyBeneficiaryCol() {
  await makeSureInit(bountyBeneficiaryCol);
  return bountyBeneficiaryCol;
}

async function getBountyCuratorCol() {
  await makeSureInit(bountyCuratorCol);
  return bountyCuratorCol;
}

function getTreasuryDb() {
  return db;
}

module.exports = {
  initTreasuryScanDb,
  getTreasuryDb,
  getTipCol,
  getTipBeneficiaryCol,
  getTipFinderCol,
  getProposalBeneficiaryCol,
  getBountyBeneficiaryCol,
  getBountyCuratorCol,
}

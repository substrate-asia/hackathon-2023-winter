const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let councilorCol = null;
let validatorCol = null;

async function initRoleScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_ROLE_SCAN_URL"),
    getEnvOrThrow("MONGO_ROLE_SCAN_NAME"),
  );
  await db.init();

  councilorCol = await db.createCol("councilor");
  validatorCol = await db.createCol("validator");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await councilorCol.createIndex({ address: 1 }, { unique: true });
}

async function makeSureInit(col) {
  if (!col) {
    await initRoleScanDb();
  }
}

function getRoleDb() {
  return db;
}

async function getCouncilorCol() {
  await makeSureInit(councilorCol);
  return councilorCol;
}

async function getValidatorCol() {
  await makeSureInit(validatorCol);
  return validatorCol;
}

module.exports = {
  initRoleScanDb,
  getRoleDb,
  getCouncilorCol,
  getValidatorCol,
};

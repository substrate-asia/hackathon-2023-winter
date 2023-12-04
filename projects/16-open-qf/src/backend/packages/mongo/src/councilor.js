const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;
let addressCol = null;

async function initCouncilorScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_COUNCILOR_SCAN_URL"),
    getEnvOrThrow("MONGO_COUNCILOR_SCAN_NAME"),
  );
  await db.init();

  addressCol = await db.createCol("address");
  _createIndexes().then(() => console.log("DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first");
    process.exit(1);
  }

  await addressCol.createIndex({ address: 1 }, { unique: true });
}

async function makeSureInit(col) {
  if (!col) {
    await initCouncilorScanDb();
  }
}

function getCouncilorDb() {
  return db;
}

async function getAddressCol() {
  await makeSureInit(addressCol);
  return addressCol;
}

module.exports = {
  initCouncilorScanDb,
  getAddressCol,
  getCouncilorDb,
};

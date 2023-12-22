require("dotenv").config();

const {
  chain: {
    updateSpecs,
    subscribeChainHeight,
    checkSpecs,
  },
  env: {
    isUseMetaDb,
  }
} = require("@osn/scan-common");
const { treasury: { initTreasuryScanDb } } = require("@open-qf/mongo");
const { scan } = require("./scan");

async function main() {
  await initTreasuryScanDb();
  await subscribeChainHeight();
  if (isUseMetaDb()) {
    await updateSpecs();
    checkSpecs();
  }

  await scan();
}

main()
  .then(() => console.log("Scan finished"))
  .catch(console.error)

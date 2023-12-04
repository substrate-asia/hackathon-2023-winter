require("dotenv").config();

const {
  chain: {
    subscribeChainHeight,
    updateSpecs,
    checkSpecs,
  },
  env: {
    isUseMetaDb,
  }
} = require("@osn/scan-common");
const { councilor: { initCouncilorScanDb } } = require("@open-qf/mongo");

async function main() {
  await initCouncilorScanDb();
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

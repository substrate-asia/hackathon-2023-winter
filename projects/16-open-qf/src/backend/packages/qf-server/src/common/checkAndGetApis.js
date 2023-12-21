const { getApis } = require("@osn/polkadot-api-container");

function checkAndGetApis(chain) {
  const apis = getApis(chain);
  if (apis.every((api) => !api.isConnected)) {
    throw new Error("No apis connected");
  }

  return apis;
}

module.exports = {
  checkAndGetApis,
}

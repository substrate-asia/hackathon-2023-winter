const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function getValidators(blockHash) {
  const blockApi = await findBlockApi(blockHash);
  const validators = await blockApi.query.session.validators();
  return validators.toJSON();
}

module.exports = {
  getValidators,
}

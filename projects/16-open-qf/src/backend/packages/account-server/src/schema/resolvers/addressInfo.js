const {
  treasury: { getTipFinderCol, getTipBeneficiaryCol }
} = require("@open-qf/mongo");
const { utils: { isValidAddress } } = require("@open-qf/common");

async function addressInfo(_, _args) {
  const { address } = _args;
  if (!isValidAddress(address)) {
    return { isTipFinder: false, isTipBeneficiary: false };
  }

  const finderCol = await getTipFinderCol();
  const maybeInDbFinder = await finderCol.findOne({ address });

  const beneficiaryCol = await getTipBeneficiaryCol();
  const maybeInDbBeneficiary = await beneficiaryCol.findOne({ address });

  return { isTipFinder: !!maybeInDbFinder, isTipBeneficiary: !!maybeInDbBeneficiary };
}

module.exports = {
  addressInfo,
}

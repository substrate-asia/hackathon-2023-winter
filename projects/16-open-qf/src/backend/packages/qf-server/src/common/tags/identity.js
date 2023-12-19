const { queryFromApis } = require("../queryFromApis");
const { checkAndGetApis } = require("../checkAndGetApis");
const { chains } = require("../../consts");

async function queryIdentityVerificationFromOneApi(api, address) {
  if (!api.query.identity?.identityOf) {
    return false;
  }

  const identityOf = await api.query.identity.identityOf(address);
  if (!identityOf.isSome) {
    return false;
  }

  const identity = identityOf.unwrap();
  return identity.judgements.some(tuple => {
    const [, judgement] = tuple;
    return ["Reasonable", "KnownGood"].includes(judgement.toString());
  });
}

async function checkIsIdentityVerified(address) {
  const polkadotApis = checkAndGetApis(chains.polkadot);
  return await queryFromApis(polkadotApis, queryIdentityVerificationFromOneApi, [address]);
}

module.exports = {
  queryIdentityVerificationFromOneApi,
  checkIsIdentityVerified,
}

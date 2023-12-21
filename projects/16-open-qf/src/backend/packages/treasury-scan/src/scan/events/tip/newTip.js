const { call: { findTargetCall } } = require("@osn/scan-common");
const { blake2AsHex } = require("@polkadot/util-crypto");
const { getTipMeta } = require("../../../query/tipMeta");
const { getTipReason } = require("../../../query/tipReason");
const { treasury: { insertTreasuryTip } } = require("@open-qf/mongo");

function getFinderFromMeta(metaJSON) {
  if (metaJSON.finder && typeof metaJSON.finder === 'string') {
    return metaJSON.finder;
  }

  if (metaJSON.finder && Array.isArray(metaJSON.finder)) {
    return metaJSON.finder[0];
  }

  return metaJSON.tips[0][0]
}

async function handleNewTip(event, indexer, extrinsic) {
  const hash = event.data[0].toString();
  const meta = await getTipMeta(indexer.blockHash, hash);
  const metaJson = meta.toJSON();
  const finder = getFinderFromMeta(metaJson);

  const reasonHash = metaJson.reason;
  const reason = await getTipReason(indexer.blockHash, reasonHash);

  const newTipCall = findTargetCall(extrinsic.method, (call) => {
    const { section, method, args } = call;
    if (!["treasury", "tips"].includes(section) || !["tipNew", "reportAwesome"].includes(method)) {
      return null;
    }

    const hash = blake2AsHex(args[0]);
    if (hash === reasonHash) {
      return call;
    }
  });
  const method = newTipCall.method;
  const beneficiary = newTipCall.args[1].toString();

  await insertTreasuryTip({
    hash,
    height: indexer.blockHeight,
    finder,
    beneficiary,
    reason,
    method,
    state: "Proposed",
    isFinal: false,
  });
}

module.exports = {
  handleNewTip,
}

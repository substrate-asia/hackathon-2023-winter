const { queryReferendumInfo } = require("../../../query/referenda");
const { governance: { insertReferendaReferendum } } = require("@open-qf/mongo");

async function handleSubmitted(event, indexer) {
  const referendumIndex = event.data[0].toNumber();
  const trackId = event.data[1].toNumber();
  const info = await queryReferendumInfo(referendumIndex, indexer.blockHash);

  await insertReferendaReferendum({
    index: referendumIndex, trackId, indexer, info: info.ongoing, isFinal: false,
  });
}

module.exports = {
  handleSubmitted,
}

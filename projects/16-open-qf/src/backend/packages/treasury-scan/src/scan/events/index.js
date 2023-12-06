const { handleTreasuryTipEvent } = require("./tip");

async function handleEvents(events = [], blockIndexer, extrinsics = []) {
  if (events.length <= 0) {
    return;
  }

  for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
    const indexer = {
      ...blockIndexer,
      eventIndex,
    }

    const { event, phase } = events[eventIndex];
    let extrinsic;
    if (!phase.isNone) {
      const extrinsicIndex = phase.value.toNumber();
      blockIndexer = {
        ...blockIndexer,
        extrinsicIndex,
      };
      extrinsic = extrinsics[extrinsicIndex];
    }

    await handleTreasuryTipEvent(event, indexer, extrinsic, events);
  }
}

module.exports = {
  handleEvents,
}

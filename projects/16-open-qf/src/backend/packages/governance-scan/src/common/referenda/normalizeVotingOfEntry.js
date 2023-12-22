function extractAddressAndTrackId(storageKey = []) {
  const address = storageKey.args[0].toString();
  const trackId = storageKey.args[1].toNumber();

  return {
    address,
    trackId,
  };
}

function normalizeVotingOfEntry([storageKey, voting]) {
  const { address, trackId } = extractAddressAndTrackId(storageKey);
  return { account: address, trackId, voting };
}

module.exports = {
  normalizeVotingOfEntry,
}

const heightMap = {};

function addConvictionVoteHeight(blockHeight, referendumIndex) {
  const ids = heightMap[blockHeight] || [];
  heightMap[blockHeight] = [...new Set([...ids, referendumIndex])];
}

function getVotedReferenda(blockHeight) {
  return heightMap[blockHeight] || [];
}

function clearConvictionVoteHeight(blockHeight) {
  delete heightMap[blockHeight];
}

module.exports = {
  addConvictionVoteHeight,
  getVotedReferenda,
  clearConvictionVoteHeight,
}

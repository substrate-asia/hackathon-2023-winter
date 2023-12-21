const delegationMap = {};

function setConvictionDelegationMark(height) {
  delegationMap[height] = true;
}

function clearConvictionDelegationMark(height) {
  delete delegationMap[height];
}

function hasConvictionDelegationMark(height) {
  return delegationMap[height];
}

module.exports = {
  setConvictionDelegationMark,
  clearConvictionDelegationMark,
  hasConvictionDelegationMark,
}

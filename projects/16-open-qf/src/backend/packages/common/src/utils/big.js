const BigNumber = require("bignumber.js");

function gt(v1, v2) {
  return new BigNumber(v1).isGreaterThan(v2);
}

function bigAdd(v1, v2) {
  return new BigNumber(v1).plus(v2).toString();
}

module.exports = {
  gt,
}

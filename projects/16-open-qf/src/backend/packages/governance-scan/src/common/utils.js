const BigNumber = require("bignumber.js");
const LOCKS = [1, 10, 20, 30, 40, 50, 60];

function calcVotes(capital = 0, conviction = 0) {
  return new BigNumber(capital)
    .multipliedBy(LOCKS[conviction])
    .div(10).toFixed(0, 1);
}

module.exports = {
  calcVotes,
}

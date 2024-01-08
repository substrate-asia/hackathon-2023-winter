const { subscan } = require("./subscan");
const { statescan } = require("./statescan");
const { polkascan } = require("./polkascan");
const { talisman } = require("./talisman");
const { nova } = require("./nova");
const { subwallet } = require("./subwallet");
const { subsquare } = require("./subsquare");
const { polkassembly } = require("./polkassembly");
const { subquery } = require("./subquery");
const { subsquid } = require("./subsquid");
const { chopsticks } = require("./chopsticks");
const { smoldot } = require("./smoldot");

const projects = [
  subscan,
  statescan,
  polkascan,
  talisman,
  nova,
  subwallet,
  subsquare,
  polkassembly,
  subquery,
  subsquid,
  chopsticks,
  smoldot,
];

module.exports = {
  projects,
};

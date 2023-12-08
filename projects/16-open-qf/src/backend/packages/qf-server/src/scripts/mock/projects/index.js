const { subscan } = require("./subscan");
const { statescan } = require("./statescan");
const { polkascan } = require("./polkascan");

const projects = [
  subscan,
  statescan,
  polkascan,
];

module.exports = {
  projects,
}

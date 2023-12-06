const { addressInfo } = require("./info");
const { queries } = require("./query");

const typeDefs = [addressInfo, queries];

module.exports = {
  typeDefs,
};

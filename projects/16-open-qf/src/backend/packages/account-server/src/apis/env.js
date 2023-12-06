const { chains } = require("../consts");

const chainEndpointPrefixMap = {
  [chains.collectives]: "COL",
};

// [chain, endpoints]
const endpoints = Object.values(chains).map((chain) => {
  let chainEndpoints = (process.env[`${ chainEndpointPrefixMap[chain] }_ENDPOINTS`] || "").split(";");
  return {
    chain, endpoints: chainEndpoints,
  };
});

function getEndpoints() {
  return endpoints;
}

module.exports = {
  getEndpoints,
};

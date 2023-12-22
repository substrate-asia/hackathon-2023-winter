const { chains } = require("../consts");

const chainEndpointPrefixMap = {
  [chains.collectives]: "COL",
  [chains.polkadot]: "DOT",
};

// [chain, endpoints]
let endpoints = null;

function loadEndpoints() {
  return Object.values(chains).map((chain) => {
    let chainEndpoints = (
      process.env[`${chainEndpointPrefixMap[chain]}_ENDPOINTS`] || ""
    ).split(";");
    return {
      chain,
      endpoints: chainEndpoints,
    };
  });
}

function getEndpoints() {
  if (endpoints) {
    return endpoints;
  }

  endpoints = loadEndpoints();
  return endpoints;
}

module.exports = {
  getEndpoints,
};

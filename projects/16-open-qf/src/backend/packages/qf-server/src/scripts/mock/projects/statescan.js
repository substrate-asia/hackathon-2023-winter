const { category } = require("../../../utils/consts/category");

const statescan = {
  name: "Statescan",
  summary: "A set of explorers for substrate chains.",
  creator: "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4",
  donationAddress: "15YWmEvoUueukbKHzCgpg4SCpsZVgabpftMiCRQbryFXszQx",
  category: category.explorer,
  links: ["https://polkadot.statescan.io/"],
  description: `## Statescan on-chain NFT metadata support

Problems: Statescan supports NFT defined by JSON objects hosted by IPFS, but there is NFT format whose metadata and image info are defined on chain. We can not recognize it before this feature.

For development, the main work includes:

- Block business indexing to find the target NFT definition.
- Refactor and add the onchain NFT metadata parsing business to NFT parsing scripts.
- Fronted pages adaptation to this onchain NFT format.

## Cost

Taking an hour rate $80 and it will take 60 hours working time. The total cost is $4800.
`,
  bannerCid: "bafybeif6earkknc4jerhmkjlrq7ktcfwleqpdhsmvfaaws73wfjpf2rk4u",
  logoCid: "bafybeidbqmpjx5f726ozc3mmjcqvwugqymcm6xxh53qppwonpt3vmqdzbu",
};

module.exports = {
  statescan,
};

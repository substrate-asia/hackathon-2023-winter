require("dotenv").config();

const {
  chain: {
    setSpecHeights,
    fetchBlocks,
  }
} = require("@osn/scan-common");
const { handleBlock } = require("./scan");

async function main() {
  const blockHeights = [
    15476217,
    15759917,
  ];

  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);
    const [block] = await fetchBlocks([height], true);
    await handleBlock(block);
  }

  console.log("finished");
  process.exit(0);
}

main().then(console.log);

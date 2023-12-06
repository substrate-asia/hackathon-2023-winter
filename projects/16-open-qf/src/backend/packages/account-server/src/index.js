require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { schema } = require("./schema");
const { createChainApis } = require("@open-qf/node-api/src/apis");

const port = parseInt(process.env.PORT) || 6011;

async function main() {
  await createChainApis();
  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
}

main()
  .then(() => console.log("api initialized"))
  .catch((e) => console.error(e));

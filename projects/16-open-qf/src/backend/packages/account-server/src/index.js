require("dotenv").config();

const { createYoga } = require("graphql-yoga");
const { createServer } = require("http");
const { schema } = require("./schema");

const port = parseInt(process.env.PORT) || 6011;

function main() {
  const yoga = createYoga({ schema });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
}

main();

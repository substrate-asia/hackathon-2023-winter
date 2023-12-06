const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolverFunctions = require("./resolvers");
const { typeDefs } = require("./types");

const resolvers = {
  Query: {
    ...resolverFunctions,
  },
};

const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs,
});

module.exports = {
  schema,
};

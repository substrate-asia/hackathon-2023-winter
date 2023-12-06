const queries = /* GraphQL */ `
  type Query {
    addressInfo(address: String!): AddressInfo!
  }
`;

module.exports = {
  queries,
};

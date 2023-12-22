import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import React from 'react';
import "./App.css";
import TokenDashboard from './TokenDashboard';

const TOKEN_QUERY = gql`
query{
  slp_polkadot_ratio(
    where: {key: {_eq: "0"}, id: {_regex: "^.*0.{3}$"}}
    order_by: {ratio: desc}
    distinct_on: ratio
  ) {
    key
    timestamp
    ratio
    token_pool
    total_issuance
  }
}
`;

const TOKEN_DECIMALS = 10;

const client = new ApolloClient({
  uri: 'https://bifrost-subsql.liebi.com/v1/graphql',
  cache: new InMemoryCache(),
});

export const transformNodes = (nodes) => {
  return nodes.map(node => ({
    timestamp: node.timestamp.split("T")[0], // 2023-10-04T00:00:00 -> 2023-10-04
    exchangeRate: (parseFloat(node.ratio)).toFixed(3),
    totalLST: ((parseInt(node.total_issuance)) / (10 ** TOKEN_DECIMALS)).toFixed(0),
    totalDOT: ((parseInt(node.token_pool)) / (10 ** TOKEN_DECIMALS)).toFixed(0)
  })).reverse();
};

function BifrostTokenDashboard() {
  const { loading, error, data } = useQuery(TOKEN_QUERY, { client });
  let transformedData = null;
  if (!loading && !error && data) {
    transformedData = transformNodes(data.slp_polkadot_ratio);
  }
  return (
    <TokenDashboard
      loading={loading}
      error={error}
      transformedData={transformedData}
      title={"Bifrost vDOT Dashboard"}
      LSTName={"vDOT"}
    />
  )
}

export default BifrostTokenDashboard;

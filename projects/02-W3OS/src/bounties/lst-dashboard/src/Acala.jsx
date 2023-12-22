import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';
import React from 'react';
import "./App.css";
import TokenDashboard from './TokenDashboard';

const TOKEN_QUERY = gql`
query{
  dailySummaries(orderBy: TIMESTAMP_DESC, first: 360) {
    nodes{
      timestamp
      totalVoidLiquid
      exchangeRate
      liquidIssuance
      bonded
      toBondPool
    }
  }
}
`;

const TOKEN_DECIMALS = 10;

const client = new ApolloClient({
  uri: 'https://api.polkawallet.io/acala-liquid-staking-subql',
  cache: new InMemoryCache(),
});

export const transformNodes = (nodes) => {
  return nodes.map(node => ({
    timestamp: node.timestamp.split("T")[0], // 2023-10-04T00:00:00 -> 2023-10-04
    exchangeRate: (parseInt(node.exchangeRate) / (10 ** TOKEN_DECIMALS)).toFixed(3),
    totalLST: ((parseInt(node.totalVoidLiquid) + parseInt(node.liquidIssuance)) / (10 ** TOKEN_DECIMALS)).toFixed(0),
    totalDOT: ((parseInt(node.bonded) + parseInt(node.toBondPool)) / (10 ** TOKEN_DECIMALS)).toFixed(0)
  })).reverse();
};

function AcalaTokenDashboard() {
  const { loading, error, data } = useQuery(TOKEN_QUERY, { client });
  let transformedData;
  if (!loading && !error && data) {
    transformedData = transformNodes(data.dailySummaries.nodes);
  }
  return (
    <TokenDashboard
      loading={loading}
      error={error}
      transformedData={transformedData}
      title={"Acala LDOT Dashboard"}
      LSTName={"LDOT"}
    />
  )
}

export default AcalaTokenDashboard;

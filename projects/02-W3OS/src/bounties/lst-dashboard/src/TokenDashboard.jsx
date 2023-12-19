import React from 'react';
import "./App.css";
import TokenLineChart from './TokenLineGraph';
import TokenStatistic from './TokenStatistic';
import Loading from './loading';

function TokenDashboard({loading, error, transformedData, title, LSTName}) {
    if (loading) {
        return (
            <Loading />
        );
    }
    if (error) {
        console.error(error);
        alert(error.message);
    }
    if (!loading && !error && transformedData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', paddingBottom: '200px' }}>
                <h1 style={{ fontSize: '1.5em' }}>{title}</h1>
                <TokenStatistic LSTName={LSTName} transformedData={transformedData} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: "100%"}}>
                    <TokenLineChart title="Exchange Rate" yDataKey="exchangeRate" transformedData={transformedData} color="#8884d8" />
                    <TokenLineChart title="Total Locked DOT" yDataKey="totalDOT" transformedData={transformedData} color="#82ca9d" />
                    <TokenLineChart title={`Total Locked ${LSTName}`} yDataKey="totalLST" transformedData={transformedData} color="#ffc658" />
                </div>
            </div>
        );
    }
}

export default TokenDashboard;

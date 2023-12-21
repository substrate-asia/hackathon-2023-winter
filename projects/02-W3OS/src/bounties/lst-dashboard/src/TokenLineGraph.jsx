import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const TokenLineChart = ({ title, yDataKey, transformedData, color }) => {
  const maxY = Math.max(...transformedData.map(item => item[yDataKey]));
  return (
    <div style={{ height: '400px' }}>
      {title ? <h2>{title}</h2> : null}
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={transformedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis type="number" domain={[0, maxY]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yDataKey} stroke={color} dot={{ r: 1 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TokenLineChart;
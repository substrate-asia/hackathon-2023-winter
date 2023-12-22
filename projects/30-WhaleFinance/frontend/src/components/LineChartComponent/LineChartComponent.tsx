import { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CombinedDataItem {
  date: string;
  fundId: string;
  performanceValue: number;
  bmId: string;
  benchmarkValue: number;
}

interface LineChartProps {
  data: CombinedDataItem[];
}

export default class LineChartComponent extends Component<LineChartProps> {

  render() {
    const { data } = this.props;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={600}
          height={200}
          data={data}
          margin={{
            top: 50,
            right: 10,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="2" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="benchmarkValue" name={data[0]?.fundId ?? ''} stroke="#020745" />
          <Line type="monotone" dataKey="performanceValue" name={data[0]?.bmId ?? ''} stroke="#efd24a" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
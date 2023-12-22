import React from 'react';

type DashboardCardProps = {
  title: string;
  amount: number;
  trend: number;
  trendDirection: 'up' | 'down';
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, amount, trend, trendDirection }) => {
  const trendColor = trendDirection === 'up' ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-lg shadow-lg min-w-72 ${trendColor}`}>
      <h5 className="text-gray-100 text-xl">{title}</h5>
      <p className="text-gray-100 text-4xl mt-2">${amount.toLocaleString()}</p>
      <div className="flex items-center mt-4">
        <span className={`material-icons ${trendColor}`}>
          {trendDirection === 'up' ? 'arrow_upward' : 'arrow_downward'}
        </span>
        <span className={`ml-2 ${trendColor}`}>{trend}%</span>
      </div>
    </div>
  );
}

export default DashboardCard;
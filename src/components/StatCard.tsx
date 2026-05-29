
import React, { FC } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center">
        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-xl mr-5">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900 font-outfit">{value}</p>
        </div>
    </div>
);

export default StatCard;

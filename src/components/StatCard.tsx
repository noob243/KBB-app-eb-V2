import React, { FC } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4">
        <div className="bg-indigo-100 text-indigo-600 p-2.5 sm:p-3 rounded-full flex-shrink-0">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export default StatCard;

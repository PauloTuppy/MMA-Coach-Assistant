
import React from 'react';

interface InsightCardProps {
    title: string;
    children: React.ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({ title, children }) => {
    return (
        <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
            <h4 className="font-bold text-slate-800 text-lg mb-2">{title}</h4>
            <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
        </div>
    );
};

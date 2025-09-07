
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-6 text-center shadow-lg border-b-4 border-red-600">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold tracking-tight">MMA Coach Assistant</h1>
                <p className="text-lg opacity-90 mt-1">
                    Powered by Google Gemini AI • Analyze fights and create winning strategies
                </p>
            </div>
        </header>
    );
};

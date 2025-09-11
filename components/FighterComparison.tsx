import React from 'react';
import type { FighterComparisonResult, FighterComparisonInfo } from '../types';

const FighterCard: React.FC<{ fighter: FighterComparisonInfo }> = ({ fighter }) => (
    <div className="bg-gray-800 p-6 rounded-lg h-full">
        <h3 className="text-2xl font-bold text-center text-white mb-4">{fighter.name}</h3>
        
        <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-red-500 mb-2">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    {fighter.strengths.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-red-500 mb-2">Weaknesses</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    {fighter.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-red-500 mb-2">Keys to Victory</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    {fighter.keysToVictory.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

interface FighterComparisonProps {
    result: FighterComparisonResult;
}

export const FighterComparison: React.FC<FighterComparisonProps> = ({ result }) => {
    return (
        <div className="mt-8 pt-10 border-t-2 border-gray-700">
             <header className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-white">
                    Head-to-Head Tactical Breakdown
                </h2>
                <p className="mt-2 text-md text-red-500 font-semibold">An AI-powered tactical analysis of the matchup</p>
            </header>

            <div className="space-y-8">
                <div className="bg-gray-900 border-2 border-red-500 p-4 rounded-lg text-center">
                    <p className="text-sm uppercase tracking-wider text-gray-400">Victor in This Clip</p>
                    <h3 className="text-3xl font-bold text-red-500">{result.winner}</h3>
                    <p className="text-md text-gray-300">by {result.methodOfVictory}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    <FighterCard fighter={result.fighterA} />
                    <FighterCard fighter={result.fighterB} />
                </div>
                <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                     <h3 className="text-xl font-medium text-white mb-3 text-center"><i className="fa-solid fa-book-open mr-2 text-red-500"></i>Fight Summary</h3>
                     <p className="text-gray-300 text-center leading-relaxed">{result.fightSummary}</p>
                </div>
            </div>
        </div>
    );
};
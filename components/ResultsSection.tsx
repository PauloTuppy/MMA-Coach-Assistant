// components/ResultsSection.tsx
import React from 'react';
import type { AnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { InsightCard } from './InsightCard';

interface ResultsSectionProps {
    isLoading: boolean;
    analysisResult: AnalysisResult | null;
    error: string | null;
    fighterName: string;
    opponentName: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
    isLoading,
    analysisResult,
    error,
    fighterName,
    opponentName
}) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-lg font-semibold text-gray-600">Analyzing footage...</p>
                    <p className="mt-2 text-sm text-gray-500">This may take a moment. Gemini is reviewing the fights to provide expert analysis.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Analysis Failed:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            );
        }

        if (!analysisResult) {
            return (
                <div className="text-center h-full flex flex-col justify-center items-center">
                    <div className="text-6xl mb-4" role="img" aria-label="robot">🤖</div>
                    <h3 className="text-2xl font-bold text-slate-800">Ready for Analysis</h3>
                    <p className="mt-2 text-gray-500">
                        Fill in the details and upload fight videos to get a comprehensive breakdown and a strategic game plan.
                    </p>
                </div>
            );
        }

        const { fighterAnalysis, opponentAnalysis, headToHead, recommendedGamePlan } = analysisResult;

        return (
            <div className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-800 pb-2 border-b-2 border-red-500">
                    Fight Analysis &amp; Game Plan
                </h3>

                <InsightCard title={`Head-to-Head: ${fighterName || 'Fighter'} vs. ${opponentName || 'Opponent'}`}>
                    <p className="font-semibold text-gray-800">{headToHead.prediction}</p>
                    <p className="text-sm text-gray-600">Confidence: {headToHead.confidence}%</p>
                </InsightCard>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InsightCard title={`${fighterName || 'Fighter'}'s Profile`}>
                         <h5 className="font-semibold mt-2">Style:</h5>
                         <p>{fighterAnalysis.fightingStyle}</p>
                         <h5 className="font-semibold mt-2">Strengths:</h5>
                         <ul className="list-disc list-inside">
                             {fighterAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                         </ul>
                         <h5 className="font-semibold mt-2">Weaknesses:</h5>
                         <ul className="list-disc list-inside">
                             {fighterAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                         </ul>
                     </InsightCard>
                     <InsightCard title={`${opponentName || 'Opponent'}'s Profile`}>
                         <h5 className="font-semibold mt-2">Style:</h5>
                         <p>{opponentAnalysis.fightingStyle}</p>
                         <h5 className="font-semibold mt-2">Strengths:</h5>
                         <ul className="list-disc list-inside">
                             {opponentAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                         </ul>
                         <h5 className="font-semibold mt-2">Weaknesses:</h5>
                         <ul className="list-disc list-inside">
                             {opponentAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                         </ul>
                     </InsightCard>
                </div>

                <InsightCard title={`Recommended Game Plan for ${fighterName || 'Fighter'}`}>
                    <h5 className="font-semibold">Strategy:</h5>
                    <p>{recommendedGamePlan.strategy}</p>
                    <h5 className="font-semibold mt-3">Key Tactics:</h5>
                     <ul className="list-disc list-inside">
                         {recommendedGamePlan.keyTactics.map((t, i) => <li key={i}>{t}</li>)}
                     </ul>
                    <h5 className="font-semibold mt-3">Recommended Drills:</h5>
                     <ul className="list-disc list-inside">
                         {recommendedGamePlan.drills.map((d, i) => <li key={i}>{d}</li>)}
                     </ul>
                </InsightCard>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md h-full">
            {renderContent()}
        </div>
    );
};

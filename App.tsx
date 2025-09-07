import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadSection } from './components/UploadSection';
import { ResultsSection } from './components/ResultsSection';
import { TutorialSection } from './components/TutorialSection';
import type { AnalysisResult } from './types';
import { analyzeFights } from './services/geminiService';

const App: React.FC = () => {
    const [fighterName, setFighterName] = useState<string>('');
    const [opponentName, setOpponentName] = useState<string>('');
    const [weightClass, setWeightClass] = useState<string>('');
    const [fighterVideo, setFighterVideo] = useState<File | null>(null);
    const [opponentVideo, setOpponentVideo] = useState<File | null>(null);

    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        if (!fighterName || !opponentName || !weightClass || !fighterVideo || !opponentVideo) {
            setError('Please fill in all fields and upload both videos.');
            return;
        }

        setError(null);
        setIsLoading(true);
        setAnalysisResult(null);

        try {
            const result = await analyzeFights(fighterName, opponentName, weightClass, fighterVideo, opponentVideo);
            setAnalysisResult(result);
        } catch (err) {
            console.error('Analysis failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
            setError(`Analysis failed: ${errorMessage}. Please check the console for more details.`);
        } finally {
            setIsLoading(false);
        }
    }, [fighterName, opponentName, weightClass, fighterVideo, opponentVideo]);
    
    const resetForm = useCallback(() => {
        setFighterName('');
        setOpponentName('');
        setWeightClass('');
        setFighterVideo(null);
        setOpponentVideo(null);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main app content (uploader and results) */}
                    <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <UploadSection
                            fighterName={fighterName}
                            setFighterName={setFighterName}
                            opponentName={opponentName}
                            setOpponentName={setOpponentName}
                            weightClass={weightClass}
                            setWeightClass={setWeightClass}
                            fighterVideo={fighterVideo}
                            setFighterVideo={setFighterVideo}
                            opponentVideo={opponentVideo}
                            setOpponentVideo={setOpponentVideo}
                            onAnalyze={handleAnalyze}
                            isLoading={isLoading}
                            onReset={resetForm}
                        />
                        <ResultsSection
                            isLoading={isLoading}
                            analysisResult={analysisResult}
                            error={error}
                            fighterName={fighterName}
                            opponentName={opponentName}
                        />
                    </div>

                    {/* Tutorial Section */}
                    <div className="xl:col-span-1">
                       <TutorialSection />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
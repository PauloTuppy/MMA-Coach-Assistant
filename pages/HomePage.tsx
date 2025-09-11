import React, { useState, useEffect, useRef } from 'react';
import { UploadSection } from '../components/UploadSection';
import { ResultsSection } from '../components/ResultsSection';
import { TrainingSchedule } from '../components/TrainingSchedule';
import { analyzeFightVideo, analyzeFightVideoFromUrl } from '../services/geminiCoachService';
import { uploadVideoToGCS, checkBackendHealth, formatFileSize, formatTime, estimateTimeRemaining } from '../services/uploadService';
import type { UploadProgress } from '../services/uploadService';
import type { AnalysisResult, AnalysisState, FighterProfile } from '../types';
import { Spinner } from '../components/Spinner';
import { WEIGHT_CLASSES, FILE_UPLOAD } from '../constants';
import { MerchSearchSection } from '../components/MerchSearchSection';
import { ShareResultsSection } from '../components/ShareResultsSection';
import { FighterComparison } from '../components/FighterComparison';
import { validateVideoDuration, formatDuration } from '../utils/videoUtils';

interface HomePageProps {
    fighterProfile: FighterProfile | null;
}

export const HomePage: React.FC<HomePageProps> = ({ fighterProfile }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStartTime, setUploadStartTime] = useState<number>(0);
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
    const [backendAvailable, setBackendAvailable] = useState<boolean>(true);

    const [fighterName, setFighterName] = useState('The Natural');
    const [opponentName, setOpponentName] = useState('');
    const [weightClass, setWeightClass] = useState(WEIGHT_CLASSES[3]);

    useEffect(() => {
        if (fighterProfile) {
            setFighterName(fighterProfile.name);
            setWeightClass(fighterProfile.weightClass);
        }
    }, [fighterProfile]);

    // Verificar se o backend está disponível
    useEffect(() => {
        const checkBackend = async () => {
            const isAvailable = await checkBackendHealth();
            setBackendAvailable(isAvailable);
            if (!isAvailable) {
                console.warn('Backend não está disponível. Usando método base64 como fallback.');
            }
        };

        checkBackend();
    }, []);
    

    const handleFileSelect = async (file: File) => {
        try {
            // Validate video duration
            const durationError = await validateVideoDuration(file);
            if (durationError) {
                setError(durationError);
                return;
            }

            setSelectedFile(file);
            setError(null);
            setResults(null);
            setAnalysisState('idle');
        } catch (error) {
            setError('Error validating video file. Please try again.');
        }
    };

    const resetState = () => {
        setSelectedFile(null);
        setAnalysisState('idle');
        setError(null);
        setResults(null);
        setOpponentName('');
        setUploadProgress(0);
        setUploadStartTime(0);
        setUploadedVideoUrl(null);
        if (fighterProfile) {
            setFighterName(fighterProfile.name);
            setWeightClass(fighterProfile.weightClass);
        } else {
            setFighterName('The Natural');
            setWeightClass(WEIGHT_CLASSES[3]);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile || !fighterName || !opponentName) return;

        setError(null);
        setResults(null);
        setUploadProgress(0);
        setUploadStartTime(Date.now());

        try {
            setAnalysisState('analyzing');

            let analysisData: AnalysisResult;

            // Usar GCS se o backend estiver disponível e o arquivo for maior que 50MB
            if (backendAvailable && selectedFile.size > FILE_UPLOAD.GCS_THRESHOLD_BYTES) { // Use GCS for files > 50MB
                console.log('Usando fluxo otimizado via Google Cloud Storage');

                // Upload para GCS
                const uploadResult = await uploadVideoToGCS(selectedFile, (progress: UploadProgress) => {
                    setUploadProgress(Math.round(progress.percentage * 0.7)); // 70% para upload
                });

                if (!uploadResult.success || !uploadResult.data) {
                    throw new Error(uploadResult.error || 'Falha no upload para GCS');
                }

                setUploadedVideoUrl(uploadResult.data.signedUrl);
                setUploadProgress(70);

                // Analisar usando URL
                analysisData = await analyzeFightVideoFromUrl(
                    uploadResult.data.signedUrl,
                    selectedFile.type,
                    fighterName,
                    opponentName,
                    weightClass
                );

            } else {
                console.log('Usando fluxo tradicional com base64');

                // Fallback para base64 (arquivos menores ou backend indisponível)
                const base64EncodedData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentLoaded = Math.round((event.loaded / event.total) * 100);
                            setUploadProgress(Math.round(percentLoaded * 0.7)); // 70% para leitura
                        }
                    };

                    reader.onloadend = () => {
                        setUploadProgress(70);
                        const result = reader.result as string;
                        resolve(result.split(',')[1]);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(selectedFile);
                });

                analysisData = await analyzeFightVideo(
                    base64EncodedData,
                    selectedFile.type,
                    fighterName,
                    opponentName,
                    weightClass
                );
            }

            setUploadProgress(100);
            setResults(analysisData);
            setAnalysisState('success');

        } catch (e: any) {
            console.error('Analysis error:', e);

            // Provide more specific error messages
            let errorMessage = 'An unknown error occurred.';

            if (e.message?.includes('413') || e.message?.includes('Request Entity Too Large')) {
                errorMessage = `File too large for processing. Maximum size: ${FILE_UPLOAD.MAX_SIZE_MB}MB. Files over ${FILE_UPLOAD.GCS_THRESHOLD_MB}MB automatically use GCS upload.`;
            } else if (e.message?.includes('400')) {
                errorMessage = 'Invalid video format or corrupted file. Please try a different video.';
            } else if (e.message?.includes('401') || e.message?.includes('403')) {
                errorMessage = 'API authentication error. Please check your Gemini API key configuration.';
            } else if (e.message?.includes('429')) {
                errorMessage = 'API rate limit exceeded. Please wait a moment and try again.';
            } else if (e.message?.includes('network') || e.message?.includes('fetch')) {
                errorMessage = 'Network error. Please check your internet connection and try again.';
            } else if (e.message?.includes('upload') || e.message?.includes('GCS')) {
                errorMessage = `Upload error: ${e.message}. Trying fallback method...`;
                // Tentar fallback para base64 se o upload GCS falhar
                if (backendAvailable) {
                    setBackendAvailable(false);
                    setTimeout(() => handleAnalyze(), 1000);
                    return;
                }
            } else if (e.message) {
                errorMessage = e.message;
            }

            setError(errorMessage);
            setAnalysisState('error');
        }
    };
    
    const isProcessing = analysisState === 'analyzing';

    return (
        <main className="flex-grow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
                            MMA Coach Assistant
                        </h1>
                        <p className="mt-3 text-lg text-red-500 font-semibold">Analyze fights and improve your technique with AI-powered insights</p>
                    </header>

                    <div className="flex justify-end mb-4">
                        <a href="#/profile" className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-300 text-sm">
                            <i className="fa-solid fa-user-pen mr-2"></i> Fighter Profile
                        </a>
                    </div>

                    <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="fighterName" className="block text-sm font-medium text-gray-300 mb-1">Your Fighter</label>
                                <input
                                    type="text"
                                    id="fighterName"
                                    value={fighterName}
                                    onChange={(e) => setFighterName(e.target.value)}
                                    placeholder="e.g., John 'The Natural' Doe"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    disabled={isProcessing}
                                />
                            </div>
                            <div>
                                <label htmlFor="opponentName" className="block text-sm font-medium text-gray-300 mb-1">Opponent</label>
                                <input
                                    type="text"
                                    id="opponentName"
                                    value={opponentName}
                                    onChange={(e) => setOpponentName(e.target.value)}
                                    placeholder="e.g., Jane 'The Challenger' Smith"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    disabled={isProcessing}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="weightClass" className="block text-sm font-medium text-gray-300 mb-1">Weight Class</label>
                                <select
                                    id="weightClass"
                                    value={weightClass}
                                    onChange={(e) => setWeightClass(e.target.value)}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    disabled={isProcessing}
                                >
                                    {WEIGHT_CLASSES.map(wc => <option key={wc} value={wc}>{wc}</option>)}
                                </select>
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-white mb-4 text-center">Upload Your Fight Video</h2>
                        <UploadSection
                            onFileSelect={handleFileSelect}
                            disabled={isProcessing}
                            progress={uploadProgress}
                            selectedFile={selectedFile}
                            backendAvailable={backendAvailable}
                        />

                        {analysisState === 'error' && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md relative mt-6" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-end space-x-3 mt-6">
                            {isProcessing && (
                                <button
                                    onClick={resetState}
                                    className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                             {analysisState === 'success' && (
                                <button
                                    onClick={resetState}
                                    className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    Analyze Another
                                </button>
                            )}
                            <button
                                onClick={handleAnalyze}
                                disabled={!selectedFile || !fighterName || !opponentName || isProcessing}
                                className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Analyzing...' : 'Analyze Fight'}
                            </button>
                        </div>
                    </div>
                    
                    {analysisState === 'success' && results && (
                        <>
                            <ResultsSection results={results} fighterName={fighterName} />
                            <FighterComparison result={results.comparison} />
                            <ShareResultsSection fighterName={fighterName} results={results} />
                            <TrainingSchedule schedule={results.trainingSchedule} fighterName={fighterName} />
                            <MerchSearchSection fighterName={fighterName} />
                        </>
                    )}

                </div>
            </div>
        </main>
    );
};
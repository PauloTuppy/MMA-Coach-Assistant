
import React from 'react';
import { VideoUploader } from './VideoUploader';
import { Spinner } from './Spinner';
import { WEIGHT_CLASSES } from '../constants';
import type { Dispatch, SetStateAction } from 'react';

interface UploadSectionProps {
    fighterName: string;
    setFighterName: Dispatch<SetStateAction<string>>;
    opponentName: string;
    setOpponentName: Dispatch<SetStateAction<string>>;
    weightClass: string;
    setWeightClass: Dispatch<SetStateAction<string>>;
    fighterVideo: File | null;
    setFighterVideo: Dispatch<SetStateAction<File | null>>;
    opponentVideo: File | null;
    setOpponentVideo: Dispatch<SetStateAction<File | null>>;
    onAnalyze: () => void;
    isLoading: boolean;
    onReset: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
    fighterName, setFighterName,
    opponentName, setOpponentName,
    weightClass, setWeightClass,
    fighterVideo, setFighterVideo,
    opponentVideo, setOpponentVideo,
    onAnalyze, isLoading, onReset
}) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-500">
                Fight Details
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="fighter-name" className="block text-sm font-medium text-gray-700 mb-1">Fighter Name</label>
                    <input
                        type="text"
                        id="fighter-name"
                        value={fighterName}
                        onChange={(e) => setFighterName(e.target.value)}
                        placeholder="Enter your fighter's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    />
                </div>
                <div>
                    <label htmlFor="opponent-name" className="block text-sm font-medium text-gray-700 mb-1">Opponent Name</label>
                    <input
                        type="text"
                        id="opponent-name"
                        value={opponentName}
                        onChange={(e) => setOpponentName(e.target.value)}
                        placeholder="Enter opponent's name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    />
                </div>
                <div>
                    <label htmlFor="weight-class" className="block text-sm font-medium text-gray-700 mb-1">Weight Class</label>
                    <select
                        id="weight-class"
                        value={weightClass}
                        onChange={(e) => setWeightClass(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    >
                        <option value="">Select weight class</option>
                        {WEIGHT_CLASSES.map(wc => <option key={wc} value={wc}>{wc}</option>)}
                    </select>
                </div>

                <VideoUploader label="Upload Fighter's Fight" onFileUpload={setFighterVideo} file={fighterVideo} />
                <VideoUploader label="Upload Opponent's Fight" onFileUpload={setOpponentVideo} file={opponentVideo} />

                <div className="p-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-xs rounded-r-lg">
                    <p><strong className="font-bold">Note:</strong> Uploads over ~30MB may fail depending on the cloud hosting provider's limits. If you encounter errors, please try using smaller video clips.</p>
                </div>
                
                <div className="pt-4 space-y-2">
                    <button
                        onClick={onAnalyze}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-md hover:from-red-700 hover:to-red-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {isLoading ? <><Spinner /> Analyzing...</> : "Analyze Fights & Generate Plan"}
                    </button>
                    <button
                        onClick={onReset}
                        disabled={isLoading}
                        className="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Reset
                    </button>
                </div>
            </div>
        </div>
    );
};
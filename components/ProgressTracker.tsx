import React from 'react';

interface ProgressTrackerProps {
    progress: number;
    statusText: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, statusText }) => {
    return (
        <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{statusText}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
                <div 
                    className="h-full bg-red-600 rounded-full transition-all duration-300 ease-linear" 
                    style={{ width: `${progress}%` }}>
                </div>
            </div>
        </div>
    );
};

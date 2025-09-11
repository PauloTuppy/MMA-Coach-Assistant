import React from 'react';
import type { AnalysisResult } from '../types';

interface ShareResultsSectionProps {
    fighterName: string;
    results: AnalysisResult;
}

export const ShareResultsSection: React.FC<ShareResultsSectionProps> = ({ fighterName, results }) => {
    
    const generateShareText = () => {
        return `Just analyzed ${fighterName}'s performance with the AI MMA Coach! Key stats: ${results.strikeAccuracy}% accuracy, ${results.successfulTakedowns} successful takedowns, and an average of ${results.avgStrikesPerMin.toFixed(1)} strikes/min. Time to level up! #MMA #AICoach`;
    };

    const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp' | 'copy') => {
        const shareText = generateShareText();
        const encodedText = encodeURIComponent(shareText);
        let url = '';

        switch (platform) {
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodedText}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                break;
            case 'facebook':
                const currentUrl = encodeURIComponent(window.location.href);
                url = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                break;
            case 'whatsapp':
                 url = `https://api.whatsapp.com/send?text=${encodedText}`;
                 window.open(url, '_blank', 'noopener,noreferrer');
                 break;
            case 'copy':
                navigator.clipboard.writeText(shareText)
                    .then(() => alert('Results copied to clipboard!'))
                    .catch(err => console.error('Failed to copy text: ', err));
                break;
        }
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                Share Your Analysis
            </h2>
            <p className="text-center text-gray-400 mb-6 max-w-2xl mx-auto">
                Share these AI-powered insights with your team, coach, or on social media to track your progress.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
                <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1DA1F2] text-white font-bold py-3 px-6 rounded-md hover:bg-[#1A91DA] transition duration-300 transform hover:scale-105"
                    aria-label="Share results on X (formerly Twitter)"
                >
                    <i className="fa-brands fa-x-twitter"></i> Share on X
                </button>
                <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1877F2] text-white font-bold py-3 px-6 rounded-md hover:bg-[#166FE5] transition duration-300 transform hover:scale-105"
                    aria-label="Share results on Facebook"
                >
                    <i className="fa-brands fa-facebook"></i> Share on Facebook
                </button>
                <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] text-white font-bold py-3 px-6 rounded-md hover:bg-[#1EBE59] transition duration-300 transform hover:scale-105"
                    aria-label="Share results on WhatsApp"
                >
                    <i className="fa-brands fa-whatsapp"></i> Share on WhatsApp
                </button>
                 <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gray-600 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-500 transition duration-300 transform hover:scale-105"
                    aria-label="Copy results to clipboard"
                >
                    <i className="fa-solid fa-copy"></i> Copy Text
                </button>
            </div>
        </div>
    );
};

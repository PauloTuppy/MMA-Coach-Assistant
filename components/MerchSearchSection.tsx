import React from 'react';

interface MerchSearchSectionProps {
    fighterName: string;
}

export const MerchSearchSection: React.FC<MerchSearchSectionProps> = ({ fighterName }) => {
    // Construct search URLs dynamically
    const ufcStoreUrl = `https://www.ufcstore.com/en/?query=${encodeURIComponent(fighterName)}`;
    const fullViolenceUrl = `https://www.fullviolence.com/search?q=${encodeURIComponent(fighterName)}`;

    const handleLinkClick = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mt-8">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                Find Official Gear for <span className="text-red-500">{fighterName}</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button
                    onClick={() => handleLinkClick(ufcStoreUrl)}
                    className="flex items-center justify-center w-full sm:w-auto bg-gray-200 text-black font-bold py-3 px-6 rounded-md hover:bg-white transition duration-300 transform hover:scale-105"
                    aria-label={`Search for ${fighterName} merchandise on UFC Store`}
                >
                    <i className="fa-solid fa-shirt mr-3"></i> Shop on UFC Store
                </button>
                <button
                    onClick={() => handleLinkClick(fullViolenceUrl)}
                    className="flex items-center justify-center w-full sm:w-auto bg-yellow-400 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition duration-300 transform hover:scale-105"
                    aria-label={`Search for ${fighterName} merchandise on Full Violence`}
                >
                    <i className="fa-solid fa-fire-flame-curved mr-3"></i> Shop on Full Violence
                </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
                Note: You will be redirected to an external website.
            </p>
        </div>
    );
};
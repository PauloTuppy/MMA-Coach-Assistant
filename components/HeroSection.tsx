import React from 'react';

interface HeroSectionProps {
    storeName: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ storeName }) => {
    return (
        <div 
            className="relative bg-cover bg-center h-[60vh] flex items-center justify-center text-center text-white"
            style={{ backgroundImage: "url('https://placehold.co/1920x1080/000000/ffffff?text=FIGHTER+HERO+IMAGE')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 p-4">
                <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wider leading-tight">
                    The Official <span className="text-red-500">{storeName}</span> Store
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-lg md:text-xl text-gray-200">
                    Authentic apparel and collectibles for the true fans. Wear the legacy.
                </p>
                <button className="mt-8 bg-red-600 text-white font-bold py-3 px-8 rounded-md hover:bg-red-700 transition duration-300 transform hover:scale-105 text-lg uppercase">
                    Shop Now
                </button>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import type { FighterProfile } from '../types';
import { WEIGHT_CLASSES } from '../constants';

const defaultProfile: FighterProfile = {
    name: '',
    weightClass: WEIGHT_CLASSES[3],
    wins: 0,
    losses: 0,
    draws: 0,
};

export const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<FighterProfile>(defaultProfile);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('fighterProfile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
        } catch (error) {
            console.error("Failed to load profile from localStorage", error);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
        setSaved(false);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const profileToSave = {
                ...profile,
                wins: Number(profile.wins) || 0,
                losses: Number(profile.losses) || 0,
                draws: Number(profile.draws) || 0,
            };
            localStorage.setItem('fighterProfile', JSON.stringify(profileToSave));
            setSaved(true);
            setTimeout(() => setSaved(false), 2000); // Hide message after 2s
        } catch (error) {
            console.error("Failed to save profile to localStorage", error);
            alert("Could not save profile.");
        }
    };

    const handleSherdogSearch = () => {
        if (!profile.name.trim()) return;
        const searchName = encodeURIComponent(profile.name.trim());
        const url = `https://www.sherdog.com/stats/fightfinder?SearchTxt=${searchName}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <main className="flex-grow">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-2xl mx-auto">
                     <header className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
                            Fighter Profile
                        </h1>
                        <p className="mt-3 text-lg text-red-500 font-semibold">Manage your fighter's information</p>
                    </header>
                    <form onSubmit={handleSave} className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Fighter Name / Nickname</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleChange}
                                    placeholder="e.g., John 'The Natural' Doe"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleSherdogSearch}
                                    disabled={!profile.name.trim()}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-red-500 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                                    title="Search fighter on Sherdog.com"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Use the search to find official stats on Sherdog.com.
                            </p>
                        </div>
                        <div>
                            <label htmlFor="weightClass" className="block text-sm font-medium text-gray-300 mb-1">Weight Class</label>
                            <select
                                id="weightClass"
                                name="weightClass"
                                value={profile.weightClass}
                                onChange={handleChange}
                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                            >
                                {WEIGHT_CLASSES.map(wc => <option key={wc} value={wc}>{wc}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-1">Fight Record</label>
                             <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="wins" className="block text-xs text-gray-400">Wins</label>
                                    <input type="number" id="wins" name="wins" value={profile.wins} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white" min="0"/>
                                </div>
                                 <div>
                                    <label htmlFor="losses" className="block text-xs text-gray-400">Losses</label>
                                    <input type="number" id="losses" name="losses" value={profile.losses} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white" min="0"/>
                                </div>
                                 <div>
                                    <label htmlFor="draws" className="block text-xs text-gray-400">Draws</label>
                                    <input type="number" id="draws" name="draws" value={profile.draws} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white" min="0"/>
                                </div>
                             </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <a href="#/coach" className="px-6 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
                                <i className="fa-solid fa-arrow-left mr-2"></i> Back to Coach
                            </a>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
                            >
                                <i className={`fa-solid ${saved ? 'fa-check' : 'fa-save'} mr-2`}></i> {saved ? 'Saved!' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};
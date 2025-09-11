// types.ts
export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface TrainingSchedule {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

// New types for the Coach Assistant
export interface AnalysisResult {
    strikeAccuracy: number;
    successfulTakedowns: number;
    avgStrikesPerMin: number;
    grapplingExchangesWon: number;
    submissionAttempts: number;
    defensiveSlips: number;
    defensiveBlocks: number;
    controlTimeSeconds: number;
    keyInsights: string[];
    trainingFocus: {
        title: string;
        points: string[];
    };
    trainingSchedule: TrainingSchedule;
    comparison: FighterComparisonResult; // Integrated comparison is now required
}

export type AnalysisState = 'idle' | 'analyzing' | 'success' | 'error';

// New type for Fighter Profile
export interface FighterProfile {
    name: string;
    weightClass: string;
    wins: number;
    losses: number;
    draws: number;
}

// New types for Fighter Comparison
export interface FighterComparisonInfo {
    name: string;
    strengths: string[];
    weaknesses: string[];
    keysToVictory: string[];
}

export interface FighterComparisonResult {
    fighterA: FighterComparisonInfo;
    fighterB: FighterComparisonInfo;
    fightSummary: string;
    winner: string;
    methodOfVictory: string;
}
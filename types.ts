// types.ts
export interface FighterAnalysis {
    strengths: string[];
    weaknesses: string[];
    fightingStyle: string;
}

export interface GamePlan {
    strategy: string;
    keyTactics: string[];
    drills: string[];
}

export interface AnalysisResult {
    fighterAnalysis: FighterAnalysis;
    opponentAnalysis: FighterAnalysis;
    headToHead: {
        prediction: string;
        confidence: number;
    };
    recommendedGamePlan: GamePlan;
}

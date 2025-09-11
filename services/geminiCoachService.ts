import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.');
}
const ai = new GoogleGenAI({ apiKey });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        strikeAccuracy: {
            type: Type.NUMBER,
            description: 'The estimated strike accuracy of the primary fighter as a percentage (e.g., 87 for 87%).'
        },
        successfulTakedowns: {
            type: Type.INTEGER,
            description: 'The total number of successful takedowns by the primary fighter.'
        },
        avgStrikesPerMin: {
            type: Type.NUMBER,
            description: 'The average number of significant strikes landed per minute by the primary fighter.'
        },
        grapplingExchangesWon: {
            type: Type.INTEGER,
            description: 'The number of grappling exchanges won or resulted in a dominant position for the primary fighter.'
        },
        submissionAttempts: {
            type: Type.INTEGER,
            description: 'The number of submission attempts made by the primary fighter.'
        },
        defensiveSlips: {
            type: Type.INTEGER,
            description: 'The number of successful defensive slips (head movement to avoid strikes) by the primary fighter.'
        },
        defensiveBlocks: {
            type: Type.INTEGER,
            description: 'The number of successful defensive blocks of significant strikes by the primary fighter.'
        },
        controlTimeSeconds: {
            type: Type.INTEGER,
            description: 'The total time in seconds the primary fighter maintained control in the clinch or on the ground.'
        },
        keyInsights: {
            type: Type.ARRAY,
            description: 'A list of 3-5 brief, actionable key insights about the fighter\'s performance.',
            items: { type: Type.STRING }
        },
        trainingFocus: {
            type: Type.OBJECT,
            description: 'A recommended training focus based on the analysis.',
            properties: {
                title: { type: Type.STRING, description: 'A concise title for the training focus area.' },
                points: {
                    type: Type.ARRAY,
                    description: 'A list of 2-3 specific drills or areas to work on.',
                    items: { type: Type.STRING }
                }
            },
            required: ["title", "points"]
        },
        trainingSchedule: {
            type: Type.OBJECT,
            description: 'A recommended 7-day training schedule based on the analysis findings. Each day should have a specific focus.',
            properties: {
                monday: { type: Type.STRING, description: "Training focus for Monday." },
                tuesday: { type: Type.STRING, description: "Training focus for Tuesday." },
                wednesday: { type: Type.STRING, description: "Training focus for Wednesday." },
                thursday: { type: Type.STRING, description: "Training focus for Thursday." },
                friday: { type: Type.STRING, description: "Training focus for Friday." },
                saturday: { type: Type.STRING, description: "Training focus for Saturday." },
                sunday: { type: Type.STRING, description: "Training focus or rest day for Sunday." }
            },
            required: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        },
        comparison: {
            type: Type.OBJECT,
            description: "A head-to-head breakdown based *only* on the provided video clip.",
            properties: {
                fighterA: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strengths displayed in this specific clip." },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weaknesses displayed in this specific clip." },
                        keysToVictory: { type: Type.ARRAY, items: { type: Type.STRING }, description: "How this fighter could have won or secured the win, based on the clip." },
                    },
                    required: ["name", "strengths", "weaknesses", "keysToVictory"]
                },
                fighterB: {
                     type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strengths displayed in this specific clip." },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Weaknesses displayed in this specific clip." },
                        keysToVictory: { type: Type.ARRAY, items: { type: Type.STRING }, description: "How this fighter could have won or secured the win, based on the clip." },
                    },
                    required: ["name", "strengths", "weaknesses", "keysToVictory"]
                },
                fightSummary: {
                    type: Type.STRING,
                    description: "A summary of how the fight played out in the provided video clip, focusing on the key moments."
                },
                winner: {
                    type: Type.STRING,
                    description: "The name of the fighter who won in the provided clip. If it's not clear or the fight is ongoing, state 'Not clear from clip'."
                },
                methodOfVictory: {
                    type: Type.STRING,
                    description: "The method of victory observed in the clip (e.g., TKO, Submission, Dominant Position). If not applicable, state 'N/A'."
                }
            },
            required: ["fighterA", "fighterB", "fightSummary", "winner", "methodOfVictory"]
        }
    },
    required: [
        "strikeAccuracy", "successfulTakedowns", "avgStrikesPerMin", 
        "grapplingExchangesWon", "submissionAttempts", "defensiveSlips", "defensiveBlocks", "controlTimeSeconds",
        "keyInsights", "trainingFocus", "trainingSchedule", "comparison"
    ]
};


// Function to analyze the video using GCS URL
export const analyzeFightVideoFromUrl = async (videoUrl: string, mimeType: string, fighterName: string, opponentName: string, weightClass: string): Promise<AnalysisResult> => {
    const systemInstruction = `You are an expert MMA (Mixed Martial Arts) coach and analyst. Your task is to analyze the provided fight video clip and generate a single, comprehensive report in JSON format. The report must include two parts: 1) A data-driven performance analysis of the primary fighter, including striking, grappling, defensive maneuvers, and control time. 2) A head-to-head comparison of both fighters based *exclusively* on what is shown in the video clip. This comparison must identify the winner of the exchange or fight shown in the clip and how they won. Provide objective feedback and actionable advice. Respond ONLY with a valid JSON object that adheres to the provided schema.`;

    const textPart = {
        text: `Analyze this MMA fight footage. The primary fighter for the detailed performance stats is ${fighterName}. The opponent is ${opponentName}. The weight class is ${weightClass}.
Part 1: Provide a detailed performance breakdown for ${fighterName}, including strike accuracy, successful takedowns, average strikes per minute, grappling exchanges won, submission attempts, defensive slips, defensive blocks, and control time in seconds.
Part 2: Provide a head-to-head tactical comparison between ${fighterName} (Fighter A) and ${opponentName} (Fighter B) based *only on this video*. Analyze their strengths and weaknesses shown here. Crucially, determine who won the fight/exchange in this clip and the method of victory.`
    };

    const videoPart = {
        fileData: {
            mimeType: mimeType,
            fileUri: videoUrl,
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [videoPart, textPart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing video with Gemini:", error);
        throw new Error("Failed to get analysis from AI. The model may have been unable to process the video.");
    }
};

// Função original mantida para compatibilidade (usa base64)
export const analyzeFightVideo = async (base64VideoData: string, mimeType: string, fighterName: string, opponentName: string, weightClass: string): Promise<AnalysisResult> => {
    const systemInstruction = `You are an expert MMA (Mixed Martial Arts) coach and analyst. Your task is to analyze the provided fight video clip and generate a single, comprehensive report in JSON format. The report must include two parts: 1) A data-driven performance analysis of the primary fighter, including striking, grappling, defensive maneuvers, and control time. 2) A head-to-head comparison of both fighters based *exclusively* on what is shown in the video clip. This comparison must identify the winner of the exchange or fight shown in the clip and how they won. Provide objective feedback and actionable advice. Respond ONLY with a valid JSON object that adheres to the provided schema.`;

    const textPart = {
        text: `Analyze this MMA fight footage. The primary fighter for the detailed performance stats is ${fighterName}. The opponent is ${opponentName}. The weight class is ${weightClass}.
Part 1: Provide a detailed performance breakdown for ${fighterName}, including strike accuracy, successful takedowns, average strikes per minute, grappling exchanges won, submission attempts, defensive slips, defensive blocks, and control time in seconds.
Part 2: Provide a head-to-head tactical comparison between ${fighterName} (Fighter A) and ${opponentName} (Fighter B) based *only on this video*. Analyze their strengths and weaknesses shown here. Crucially, determine who won the fight/exchange in this clip and the method of victory.`
    };

    const videoPart = {
        inlineData: {
            mimeType: mimeType,
            data: base64VideoData,
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [videoPart, textPart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as AnalysisResult;
    } catch (error) {
        console.error("Error analyzing video with Gemini:", error);
        throw new Error("Failed to get analysis from AI. The model may have been unable to process the video.");
    }
};
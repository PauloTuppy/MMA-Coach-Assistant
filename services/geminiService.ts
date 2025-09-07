// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 * @param file The file to convert.
 * @returns A promise that resolves to the Part object.
 */
const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // The result includes the Data URL prefix, so we split it out.
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as base64 string."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            mimeType: file.type,
            data: base64EncodedData,
        },
    };
};

/**
 * Analyzes fight footage of two fighters using the Gemini API.
 * @param fighterName Name of the primary fighter.
 * @param opponentName Name of the opponent.
 * @param weightClass The weight class for the fight.
 * @param fighterVideo The video file for the primary fighter.
 * @param opponentVideo The video file for the opponent.
 * @returns A promise that resolves to the analysis result.
 */
export const analyzeFights = async (
    fighterName: string,
    opponentName: string,
    weightClass: string,
    fighterVideo: File,
    opponentVideo: File
): Promise<AnalysisResult> => {
    // The API key is expected to be available as a pre-configured environment variable.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    const fighterVideoPart = await fileToGenerativePart(fighterVideo);
    const opponentVideoPart = await fileToGenerativePart(opponentVideo);

    const prompt = `
    You are an expert MMA analyst and coach. Analyze the two fighters based on the provided videos.

    Fighter 1: ${fighterName}
    Fighter 2: ${opponentName}
    Weight Class: ${weightClass}

    Please provide a detailed analysis covering:
    1. For ${fighterName}: A list of strengths, a list of weaknesses, and a description of their fighting style.
    2. For ${opponentName}: A list of strengths, a list of weaknesses, and a description of their fighting style.
    3. A head-to-head prediction with a confidence score (from 0 to 100).
    4. A recommended game plan for ${fighterName} to defeat ${opponentName}, including an overall strategy, a list of key tactics, and a list of specific drills to practice.

    Return the analysis in a structured JSON format according to the provided schema.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            fighterAnalysis: {
                type: Type.OBJECT,
                description: `Analysis for ${fighterName}.`,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of strengths." },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of weaknesses." },
                    fightingStyle: { type: Type.STRING, description: "Description of fighting style." },
                },
            },
            opponentAnalysis: {
                type: Type.OBJECT,
                description: `Analysis for ${opponentName}.`,
                properties: {
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of strengths." },
                    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of weaknesses." },
                    fightingStyle: { type: Type.STRING, description: "Description of fighting style." },
                },
            },
            headToHead: {
                type: Type.OBJECT,
                description: "Head-to-head comparison and prediction.",
                properties: {
                    prediction: { type: Type.STRING, description: "Prediction for the fight outcome." },
                    confidence: { type: Type.NUMBER, description: "Confidence score in the prediction, from 0 to 100." },
                },
            },
            recommendedGamePlan: {
                type: Type.OBJECT,
                description: `Recommended game plan for ${fighterName}.`,
                properties: {
                    strategy: { type: Type.STRING, description: "Overall strategy for the fighter." },
                    keyTactics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific tactics to employ." },
                    drills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Drills to practice for preparation." },
                },
            },
        }
    };
    
    // Using a multimodal model to analyze video and text.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: prompt },
                { text: `\n\nFighter Video (${fighterName}):` },
                fighterVideoPart,
                { text: `\n\nOpponent Video (${opponentName}):` },
                opponentVideoPart,
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonString = response.text.trim();
    
    try {
        const parsedResult = JSON.parse(jsonString);
        return parsedResult as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse JSON response from Gemini:", jsonString, e);
        throw new Error("The analysis result from the AI was not in the expected format. Please try again.");
    }
};

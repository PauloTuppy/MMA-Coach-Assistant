import { GoogleGenAI, Type } from "@google/genai";
import type { Product } from '../types';

// IMPORTANT: You must replace 'YOUR_GEMINI_API_KEY' with your actual Google Gemini API key.
const ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY' });

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        recommendations: {
            type: Type.ARRAY,
            description: "A list of product names that are a good match for the user's request, based on the provided image and text. Only include products from the provided catalog.",
            items: {
                type: Type.OBJECT,
                properties: {
                    productName: {
                        type: Type.STRING,
                        description: "The exact name of a recommended product from the catalog."
                    },
                    reason: {
                        type: Type.STRING,
                        description: "A short, compelling reason why this product is a good recommendation for the user."
                    }
                },
                 required: ["productName", "reason"],
            }
        },
    },
    required: ["recommendations"]
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
};

export const getRecommendationsFromImage = async (
    base64ImageData: string,
    mimeType: string,
    prompt: string,
    productCatalog: Product[]
): Promise<{ productName: string; reason: string; }[]> => {

    const productCatalogText = productCatalog.map(p => `- ${p.name} (${p.category}): ${formatPrice(p.price)}`).join('\n');

    const systemInstruction = `You are an expert fashion stylist and AI shopping assistant for "THE NATURAL" brand, a merchandise line for a famous fighter. Your goal is to help users find the perfect products from the store based on an image they upload and a text prompt.

    Follow these rules strictly:
    1.  Analyze the user's uploaded image (e.g., a photo of them, a style they like, a color palette) and their text query.
    2.  Recommend products ONLY from the provided product catalog. Do not invent products.
    3.  Your response MUST be in JSON format, adhering to the provided schema.
    4.  Provide a compelling, short reason for each recommendation that connects the product to the user's image and request. Be persuasive and on-brand.
    5.  If no products are a good match, return an empty recommendations array.

    Here is the available product catalog:
    ${productCatalogText}
    `;
    
    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };

        const textPart = {
            text: `User request: "${prompt}"`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: recommendationSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson.recommendations && Array.isArray(parsedJson.recommendations)) {
            return parsedJson.recommendations;
        }

        return [];

    } catch (error) {
        console.error("Error getting recommendations from Gemini:", error);
        throw new Error("Failed to get AI recommendations. Please try again.");
    }
};

import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { InputType, Flashcard } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flashcardSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            front: {
                type: Type.STRING,
                description: "A question, term, or concept from the text."
            },
            back: {
                type: Type.STRING,
                description: "The answer or definition corresponding to the 'front'."
            }
        },
        required: ["front", "back"]
    }
};

export async function summarizeContent(type: InputType, content: string): Promise<string> {
    const prompt = type === 'url'
        ? `Please provide a detailed, well-structured summary of the content at this URL: ${content}. Focus on extracting key points, main ideas, and any crucial details or context. If the content is scholarly or academic, provide a summary suitable for research purposes.`
        : `Please provide a detailed, well-structured summary of the following text. Focus on extracting key points, main ideas, and any crucial details or context. If the content is scholarly or academic, provide a summary suitable for research purposes.\n\nTEXT: "${content}"`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text;
        return text;
    } catch (error) {
        console.error("Error summarizing content:", error);
        throw new Error("Failed to generate summary. Please check your input and try again.");
    }
}

export async function generateFlashcardsFromSummary(summary: string): Promise<Flashcard[]> {
    const prompt = `Based on the following summary, create a set of flashcards. Each flashcard should have a 'front' with a key concept, question, or term, and a 'back' with a concise answer or definition. Provide at least 5 flashcards.\n\nSUMMARY: "${summary}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: flashcardSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        return parsedJson as Flashcard[];

    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards. The AI couldn't structure the data as requested.");
    }
}

export function startChatWithSummary(summary: string): Chat {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a helpful AI assistant. The user has just read the following summary and wants to discuss it. Your knowledge is now grounded in this summary. Answer the user's questions based on this context. Do not mention that you are an AI. Be conversational and helpful.\n\nSUMMARY:\n---\n${summary}\n---`,
        },
    });
    return chat;
}

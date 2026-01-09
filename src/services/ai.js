import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let conversationHistory = [];
let queue = Promise.resolve();

async function processMessage(message, retries = 3, delay = 1000) {
    try {
        conversationHistory.push({ role: "user", parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: "gemma-3n-e4b-it",
            contents: conversationHistory,
            systemInstruction: "You are a teacher, help the student with their question. Answer *extremely briefly* and *to the point*, but still efficiently. Aim for 1 or 2 sentences maximum. Always try to answer in Spanish!",
            temperature: 0.2,
            maxOutputTokens: 100,
            topP: 0.6,
        });
        const answer = response.text;

        if (answer) {
            conversationHistory.push({ role: "model", parts: [{ text: answer }] });
            return answer;
        } else {
            return "Lo siento, algo salió mal. Intenta nuevamente.";
        }
    } catch (error) {
        if (error.message.includes("503") || error.message.includes("500") && retries > 0) {
            await new Promise(r => setTimeout(r, delay));
            return processMessage(message, retries - 1, delay * 2);
        }
        console.error('Error al interactuar con Gemini:', error);
        return 'Lo siento, algo salió mal.';
    }
}

async function sendMessageToAI(message) {
    queue = queue.then(() => processMessage(message));
    return queue;
}

export { sendMessageToAI };
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCfER8RTeEjfO3vSxvi50LGgK7wdlIUMlY" });

let conversationHistory = [];

async function sendMessageToAI(message) {
    try {
        conversationHistory.push({ role: "user", parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: "gemma-3-4b-it",
            contents: conversationHistory,
            systemInstruction: "You are a teacher, help the student with their question. Answer **extremely briefly** and **to the point**, but still efficiently. Aim for 1-2 sentences maximum.",
            temperature: 0.5,
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
        console.error('Error al interactuar con Gemini:', error);
        return 'Lo siento, algo salió mal.';
    }
}

export { sendMessageToAI };
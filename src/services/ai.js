import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.VUE_APP_HF_ACCESS_TOKEN);

const sendMessageToAI = async (message) => {
    try {
        const input = `
        ${examples}
        Ahora responde:
        Usuario: ${message}
        AI:`;

        const response = await hf.textGeneration({
            model: 'meta-llama/Meta-Llama-3-70B',
            inputs: message,
            parameters: {
                temperature: 0.1,
            }
        });

        const rawResponse = response.generated_text || "";
        const answer = rawResponse.split("AI:").pop()?.trim();

        if (answer && !answer.includes("inestabilidad") && answer.length > 0) {
            return answer;
        } else {
            return 'Lo siento, algo salió mal. Intenta nuevamente.';
        }
    } catch (error) {
        console.error('Error al interactuar con Hugging Face:', error);
        return 'Lo siento, algo salió mal.';
    }
};

export { sendMessageToAI };

import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.VUE_APP_HF_ACCESS_TOKEN);

const sendMessageToAI = async (message) => {
    try {
        const response = await hf.textGeneration({
            model: 'meta-llama/Meta-Llama-3-70B',
            inputs: message,
            parameters: {
                temperature: 0.1,
            }
        });

        return response.generated_text || 'Lo siento, algo salió mal.';
    } catch (error) {
        console.error('Error al interactuar con Hugging Face:', error);
        return 'Lo siento, algo salió mal.';
    }
};

export { sendMessageToAI };

import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.VUE_APP_HF_ACCESS_TOKEN);

const model = 'meta-llama/Llama-3.2-3B-Instruct';

const examples = `
Instrucciones: Responde de manera breve, precisa y con un tono cálido y amigable. Haz que tus respuestas sean interesantes, claras y un poco entusiastas. Evita información innecesaria.

Ejemplo 1:
Usuario: ¿Cuál es la capital de Japón?
AI: ¡La capital de Japón es Tokio! Es una ciudad fascinante, llena de tecnología y tradiciones.

Ejemplo 2:
Usuario: ¿Dónde se encuentra el río Nilo?
AI: El río Nilo atraviesa varios países en África, pero es especialmente famoso en Egipto. ¡Es uno de los ríos más largos del mundo!

Ejemplo 3:
Usuario: ¿En qué continente está Australia?
AI: ¡Australia está en Oceanía! Es conocida por sus canguros y su increíble barrera de coral.

Ejemplo 4:
Usuario: ¿Qué tipo de palabra es "rápidamente"?
AI: Es un adverbio de modo. ¡Se usa para describir cómo ocurre una acción, generalmente con rapidez!

Ejemplo 5:
Usuario: ¿Qué significa la palabra "serendipia"?
AI: Es un descubrimiento afortunado que ocurre por casualidad. ¡Es una palabra mágica, ¿no crees?!

Ejemplo 6:
Usuario: ¿Quién propuso la teoría de la relatividad?
AI: ¡Albert Einstein! Un genio que cambió nuestra forma de entender el universo.

Ejemplo 7:
Usuario: ¿A qué temperatura hierve el agua?
AI: El agua hierve a 100 grados Celsius al nivel del mar. ¡Pero cuidado! La altitud puede cambiar este valor.

Ejemplo 8:
Usuario: ¿Quién escribió "Cien años de soledad"?
AI: Fue Gabriel García Márquez, uno de los autores más importantes de la literatura latinoamericana. ¡Una obra maestra del realismo mágico!

Ejemplo 9:
Usuario: ¿Quién inventó el teléfono?
AI: Alexander Graham Bell. ¡Un invento que revolucionó la comunicación!

Ejemplo 10:
Usuario: ¿Qué es el Big Bang?
AI: Es la teoría que explica cómo comenzó el universo hace unos 13.8 mil millones de años. ¡Es fascinante, ¿no crees?!

Ejemplo 11:
Usuario: ¿Por qué los gatos ronronean?
AI: Los gatos ronronean cuando están felices, pero también para calmarse a sí mismos. ¡Es su forma especial de comunicarse!

Ejemplo 12:
Usuario: ¿Quién pintó "La última cena"?
AI: Fue Leonardo da Vinci. ¡Un genio del Renacimiento! ¿Te gusta el arte?
`;

const sendMessageToAI = async (message) => {
    try {
        const input = `
        ${examples}
        Ahora responde:
        Usuario: ${message}
        AI:`;

        const response = await hf.textGeneration({
            model: model,
            inputs: input,
            options: {
                use_cache: true,
                max_new_tokens: 50,
                temperature: 0.7,
                top_p: 0.9,
                repetition_penalty: 1.2,
                stop: ["\n", "Usuario:"]
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

<script setup>
import BaseNav from '../components/BaseNav.vue';
import BaseBody from '../components/BaseBody.vue';
import { SendHorizontalIcon, Bot } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useSubjectData } from "@/services/subjectData";
import { useUserStore } from '../stores/userStore';
import { sendMessageToAI } from '@/services/ai';
import UserAvatar from '@/components/UserAvatar.vue';

const userStore = useUserStore();
const { subjectData, fetchSubjectData } = useSubjectData();
const loading = ref(true);

onMounted(async () => {
    await userStore.fetchUser();
    await fetchSubjectData();
    loading.value = false;
});

const messages = ref([
    {
        sender: 'ai',
        text: '¡Hola! Bienvenido al chat de Inteligencia Artificial. ¿En qué puedo asistirte hoy?'
    }
]);

const userMessage = ref('');

const sendMessage = async () => {
    if (!userMessage.value) return;

    const userText = userMessage.value;
    messages.value.push({ sender: 'user', text: userText });

    userMessage.value = '';

    try {
        const aiResponse = await sendMessageToAI(userText);

        messages.value.push({ sender: 'ai', text: aiResponse });
    } catch (error) {
        console.error('Error al obtener la respuesta de la IA:', error);
        messages.value.push({ sender: 'ai', text: 'Lo siento, algo salió mal.' });
    }
};
</script>

<template>
    <BaseBody class="max-h-screen">
        <BaseNav title="Chat rápido" />
        <div class="flex flex-col justify-between gap-2 p-2 pt-0 max-h-[calc(100vh-60px)]">
            <div class="flex flex-col overflow-y-auto">
                <div class="flex flex-col justify-end gap-5 pt-2">
                    <div v-for="(message, index) in messages" :key="index" class="flex gap-2">
                        <div :class="message.sender === 'ai' ? 'bg-orange-600' : ''" class="flex items-center justify-center size-10 rounded-full text-white flex-shrink-0">
                            <Bot v-if="message.sender === 'ai'" :size="20" />
                            <UserAvatar v-if="message.sender === 'user'" size="10" />
                        </div>
                        <div class="flex flex-col w-full gap-1">
                            <span :class="message.sender === 'ai' ? 'text-orange-600' : 'text-libelo-500'" class="text-sm font-semibold">{{ message.sender === 'ai' ? 'Inteligencia Artificial' : userStore?.user.displayName }}</span>
                            <div :class="message.sender === 'ai' ? 'bg-orange-600/40' : 'bg-libelo-500'" class="p-2 rounded-xl w-fit">
                                <p :class="message.sender === 'user' ? 'text-white' : ''" class="text-sm">{{ message.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-3 w-full">
                <div class="flex justify-center items-center w-full py-2 px-4 bg-white rounded-full">
                    <p v-if="loading" class="text-sm text-neutral-700">Cargando...</p>
                    <p v-else class="text-sm text-neutral-700 break-all line-clamp-1">Chat rápido de <span class="font-semibold">{{ subjectData?.name }}</span></p>
                </div>
                <div class="flex items-center gap-3 bg-white rounded-full w-full h-14 p-2">
                    <div class="flex-shrink-0">
                        <UserAvatar size="10" />
                    </div>
                    <div class="bg-blue-950 h-full w-full">
                        <input v-model="userMessage" type="text" class="w-full h-full text-black" placeholder="Escribe un mensaje..." />
                    </div>
                    <div @click="sendMessage" class="flex items-center justify-center bg-libelo-500 size-10 rounded-full flex-shrink-0 text-white">
                        <SendHorizontalIcon :size="20" />
                    </div>
                </div>
            </div>
        </div>
    </BaseBody>
</template>
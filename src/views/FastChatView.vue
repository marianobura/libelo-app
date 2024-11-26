<script setup>
import BaseNav from '../components/BaseNav.vue';
import BaseBody from '../components/BaseBody.vue';
import { SendHorizontalIcon, Bot } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useSubjectData } from "@/services/subjectData";
import { useUserStore } from '../stores/userStore';
import { sendMessageToAI } from '@/services/ai';

const userStore = useUserStore();
const { subjectData, fetchSubjectData } = useSubjectData();

onMounted(async () => {
    await userStore.fetchUser();
    fetchSubjectData();
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

    messages.value.push({ sender: 'user', text: userMessage.value });

    const aiResponse = await sendMessageToAI(userMessage.value);

    messages.value.push({ sender: 'ai', text: aiResponse });

    userMessage.value = '';
};
</script>

<template>
    <BaseBody class="max-h-screen">
        <BaseNav title="Chat rápido" />
        <div class="flex flex-col justify-between gap-10 p-2 pt-0 max-h-[calc(100vh-60px)]">
            <div class="flex flex-col items-end overflow-y-auto">
                <div class="flex flex-col justify-end gap-5 pt-2">
                    <div v-for="(message, index) in messages" :key="index" class="flex gap-2">
                        <div :class="message.sender === 'ai' ? 'bg-orange-600' : ''" class="flex items-center justify-center size-10 rounded-full text-white flex-shrink-0">
                            <Bot v-if="message.sender === 'ai'" :size="20" />
                            <img v-if="message.sender === 'user'" src="https://avatar.iran.liara.run/public/2" alt="Imagen de perfil">
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
                <div class="flex justify-center items-center w-full py-2 bg-white rounded-full">
                    <span class="text-sm text-neutral-700">Estás en un chat rápido de {{ subjectData?.name }}</span>
                </div>
                <div class="flex items-center gap-3 bg-white rounded-full w-full h-14 p-2">
                    <div class="size-10 rounded-full flex-shrink-0">
                        <img src="https://avatar.iran.liara.run/public/2" alt="Imagen de perfil">
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
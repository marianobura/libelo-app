<script setup>
import BaseNav from '@/components/BaseNav.vue';
import BaseBody from '@/components/BaseBody.vue';
import { Bot, LoaderCircle } from 'lucide-vue-next';
import { ref, computed, watchEffect } from 'vue';
import { useSubjectStore } from "@/stores/subjectStore";
import { useUserStore } from '@/stores/userStore';
import { sendMessageToAI } from '@/services/ai';
import UserAvatar from '@/components/UserAvatar.vue';
import { useRoute } from 'vue-router';
import { reactive } from 'vue';
import ChatInput from '@/components/Chat/ChatInput.vue';
import { marked } from 'marked';

const route = useRoute();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

watchEffect(() => {
    if (route.params.id) {
        subjectStore.fetchSubject(route.params.id);
    }
});

const userDisplayName = computed(() => userStore.user?.displayName || '');

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

    const loadingMessage = reactive({ sender: 'ai', text: '', loading: true });
    messages.value.push(loadingMessage);

    try {
        const aiResponse = await sendMessageToAI(userText);

        loadingMessage.text = aiResponse;
        loadingMessage.loading = false;
    } catch (error) {
        console.error('Error al obtener la respuesta de la IA:', error);
        messages.value.push({ sender: 'ai', text: 'Lo siento, algo salió mal.' });
        loadingMessage.loading = false;
    }
};

const parseMarkdown = (text) => {
    return marked.parse(text || '');
};
</script>

<template>
    <BaseBody class="max-h-screen">
        <BaseNav title="Chat rápido" />
        <div class="flex flex-col justify-between gap-2 p-2 pt-0 max-h-[calc(100vh-60px)]">
            <div class="flex flex-col overflow-y-auto">
                <div id="container" class="flex flex-col justify-end gap-5 pt-2">
                    <div v-for="(message, index) in messages" :key="index" class="flex gap-2">
                        <div :class="message.sender === 'ai' ? 'bg-orange-600' : ''" class="flex items-center justify-center size-10 rounded-full text-white flex-shrink-0">
                            <Bot v-if="message.sender === 'ai'" :size="20" />
                            <UserAvatar v-if="message.sender === 'user'" size="10" />
                        </div>
                        <div class="flex flex-col w-full gap-1">
                            <span :class="message.sender === 'ai' ? 'text-orange-600' : 'text-libelo-500'" class="text-sm font-semibold">{{ message.sender === 'ai' ? 'Inteligencia Artificial' : userDisplayName }}</span>
                            <div :class="message.sender === 'ai' ? '' : 'bg-libelo-500 p-2'" class="rounded-xl w-fit">
                                <p v-if="message.sender === 'ai' && message.loading" class="animate-spin">
                                    <LoaderCircle />
                                </p>
                                <div v-else v-html="parseMarkdown(message.text)" :class="message.sender === 'user' ? 'text-white' : ''"  class="text-sm prose prose-sm max-w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChatInput v-model="userMessage" @sendMessage="sendMessage" />
        </div>
    </BaseBody>
</template>
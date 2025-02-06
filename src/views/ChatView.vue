<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useSubjectStore } from '@/stores/subjectStore';
import axios from 'axios';
import BaseNav from '@/components/BaseNav.vue';
import BaseBody from '@/components/BaseBody.vue';
import ChatInput from '@/components/Chat/ChatInput.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { LoaderCircle, MailX } from 'lucide-vue-next';

const userStore = useUserStore();
const subjectStore = useSubjectStore();
const route = useRoute();

const user = computed(() => userStore.user);
const subjectId = computed(() => route.params.id);

const messages = ref([]);
const userMessage = ref('');
const loading = ref(false);
const isSending = ref(false);

const fetchChatMessages = async () => {
    if (!subjectId.value) return;
    
    try {
        const apiUrl = new URL(`/api/chats/${subjectId.value}`, process.env.VUE_APP_API_URL);
        const response = await axios.get(apiUrl.toString());

        if (response.data?.data?.messages) {
            messages.value = response.data.data.messages.map(message => ({
                sender: message.sender,
                text: message.message
            }));
        }
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
    } finally {
        loading.value = false;
    }
};

const sendMessage = async () => {
    if (isSending.value || !userMessage.value.trim() || !subjectId.value) return;

    isSending.value = true;

    const newMessage = {
        subjectId: subjectId.value,
        studentId: user.value.role === 'student' ? user.value._id : null,
        teacherId: user.value.role === 'teacher' ? user.value._id : null,
        message: userMessage.value,
        sender: user.value._id,
    };

    try {
        const apiUrl = new URL(`/api/chats/${subjectId.value}`, process.env.VUE_APP_API_URL);
        await axios.post(apiUrl.toString(), newMessage);

        messages.value.push({
            sender: {
                _id: user.value._id,
                role: user.value.role,
                displayName: user.value.displayName,
            },
            text: userMessage.value
        });
        userMessage.value = '';
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
    } finally {
        isSending.value = false;
    }
};

onMounted(async () => {
    loading.value = true;
    await userStore.fetchUser();
    await subjectStore.fetchSubject(subjectId.value);
    await fetchChatMessages();
});
</script>

<template>
    <BaseBody class="max-h-screen">
        <BaseNav title="Chat profesional" />
        <div class="flex flex-col justify-between gap-2 p-2 pt-0 max-h-[calc(100vh-60px)]">
            <div :class="loading || messages.length === 0 ? 'overflow-hidden h-full' : 'overflow-y-auto mt-auto'" class="flex flex-col">
                <div :class="loading || messages.length === 0 ? 'items-center justify-center h-full' : 'justify-end'" class="flex flex-col gap-5 pt-2">
                    <div v-if="loading" class="flex flex-col gap-2 items-center justify-center w-full text-gray-500">
                        <LoaderCircle class="animate-spin" size="32"/>
                        <span class="font-medium text-lg max-w-64">Cargando mensajes...</span>
                    </div>
                    <div v-if="!loading && messages.length === 0" class="flex flex-col gap-2 items-center justify-center w-full text-gray-500">
                        <MailX size="32"/>
                        <div class="flex flex-col">
                            <span class="text-center text-lg font-medium border-b border-neutral-300 pb-2">Este chat aún no tiene mensajes.</span>
                            <span class="text-center pt-2 max-w-64">Escribe tu duda y un profesor te responderá pronto.</span>
                        </div>
                    </div>
                    <div v-else v-for="(message, index) in messages" :key="index" class="flex gap-2">
                        <div :class="message.sender.role === 'student' ? 'bg-libelo-500' : 'bg-orange-600'" class="flex items-center justify-center size-10 rounded-full text-white flex-shrink-0">
                            <UserAvatar :userLetter="message.sender.displayName.charAt(0)" :size="'10'" :orange="message.sender.role === 'teacher'" />
                        </div>
                        <div class="flex flex-col w-full gap-1">
                            <span :class="message.sender.role === 'student' ? 'text-libelo-500' : 'text-orange-600'" class="text-sm font-semibold">{{ message.sender.displayName }}</span>
                            <div :class="message.sender.role === 'student' ? 'bg-libelo-500 text-white' : 'bg-orange-600/40'" class="p-2 rounded-xl w-fit">
                                <p class="text-sm break-all">{{ message.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full">
                <ChatInput v-model="userMessage" @sendMessage="sendMessage" :isSending="isSending" />
            </div>
        </div>
    </BaseBody>
</template>

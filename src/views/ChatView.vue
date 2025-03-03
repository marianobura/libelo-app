<script setup>
import { computed, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { useChatStore } from "@/stores/chatStore";
import BaseNav from "@/components/BaseNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import ChatInput from "@/components/Chat/ChatInput.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { LoaderCircle, MailX } from "lucide-vue-next";
import axios from "axios";

const userStore = useUserStore();
const subjectStore = useSubjectStore();
const chatStore = useChatStore();
const route = useRoute();
const points = computed(() => userStore.user?.points);

const user = computed(() => userStore.user);
const subjectId = computed(() => route.params.id);

const sendMessage = (resetTextareaHeight) => {
    chatStore.sendMessage(
        chatStore.userMessage,
        user.value,
        subjectId.value,
        subjectStore.subjectData?.name,
        resetTextareaHeight
    );

    if (userStore.user.role === "teacher") {
        try {
            const newPoints = points.value + 5;
            const apiUrl = new URL(`/api/users/${userStore.user._id}`, process.env.VUE_APP_API_URL);
            axios.put(apiUrl.toString(), { points: newPoints });

            userStore.user.points = newPoints;
        } catch (error) {
            console.error("Error al actualizar los puntos:", error);
        }
    }
};

onMounted(async () => {
    chatStore.loading = true;
    await userStore.fetchUser();
    await subjectStore.fetchSubject(subjectId.value);
    await chatStore.fetchChatMessages(subjectId.value);

    nextTick(() => {
        const chatContainer = document.querySelector("#container");
        const lastMessage = chatContainer.lastElementChild;
        lastMessage?.scrollIntoView({ behavior: "smooth" });
    });
});
</script>

<template>
    <BaseBody class="max-h-screen">
        <BaseNav title="Chat profesional" />
        <div class="flex flex-col justify-between gap-2 p-2 pt-0 max-h-[calc(100vh-60px)]">
            <div :class="chatStore.loading || chatStore.messages.length === 0 ? 'overflow-hidden h-full' : 'overflow-y-auto mt-auto'" class="flex flex-col">
                <div id="container" :class="chatStore.loading || chatStore.messages.length === 0 ? 'items-center justify-center h-full' : 'justify-end'" class="flex flex-col gap-5 pt-2">
                    <div v-if="chatStore.loading" class="flex flex-col gap-2 items-center justify-center w-full text-gray-500">
                        <LoaderCircle class="animate-spin" size="32" />
                        <span class="font-medium text-lg max-w-64">Cargando mensajes...</span>
                    </div>
                    <div v-if="!chatStore.loading && chatStore.messages.length === 0" class="flex flex-col gap-2 items-center justify-center w-full text-gray-500">
                        <MailX size="32" />
                        <div class="flex flex-col">
                            <span class="text-center text-lg font-medium border-b border-neutral-300 pb-2">Este chat aún no tiene mensajes.</span>
                            <span class="text-center pt-2 max-w-64">Escribe tu duda y un profesor te responderá pronto.</span>
                        </div>
                    </div>
                    <div v-else v-for="(message, index) in chatStore.messages" :key="index" class="flex gap-2">
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
                <ChatInput v-model="chatStore.userMessage" @sendMessage="sendMessage" :isSending="chatStore.isSending" />
            </div>
        </div>
    </BaseBody>
</template>
<script setup>
import { computed, onMounted, nextTick, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { useChatStore } from "@/stores/chatStore";
import { useNotificationStore } from "@/stores/notificationStore";
import BaseNav from "@/components/BaseNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import ChatInput from "@/components/Chat/ChatInput.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { LoaderCircle, RefreshCw, Star } from "lucide-vue-next";
import axios from "axios";
import EmptyState from "@/components/EmptyState.vue";
import ChangeModal from "@/components/Chat/ChangeModal.vue";
import RateModal from "@/components/Chat/RateModal.vue";

const userStore = useUserStore();
const subjectStore = useSubjectStore();
const chatStore = useChatStore();
const notificationStore = useNotificationStore();
const route = useRoute();
const points = computed(() => userStore.user?.points);
const showChangeModal = ref(false);
const showRateModal = ref(false);
const showChangeButton = ref(false);
const showRateButton = ref(false);

const user = computed(() => userStore.user);
const subjectId = computed(() => route.params.id);

const sendMessage = () => {
    chatStore.sendMessage(
        chatStore.userMessage,
        user.value,
        subjectId.value,
        subjectStore.subject?.name
    );

    if (userStore.user._id === chatStore.chatInfo.studentId._id && chatStore.chatInfo.teacherId._id) {
        notificationStore.createNotification({
            userId: chatStore.chatInfo.teacherId,
            type: "chat",
            content: {
                chatId: chatStore.chatInfo._id,
                senderId: userStore.user._id,
                message: chatStore.userMessage,
            },
            read: false,
        })
    } else if (userStore.user._id === chatStore.chatInfo.teacherId._id) {
        notificationStore.createNotification({
            userId: chatStore.chatInfo.studentId,
            type: "chat",
            content: {
                chatId: chatStore.chatInfo._id,
                senderId: userStore.user._id,
                message: chatStore.userMessage,
            },
            read: false,
        })
    }

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
        <div class="flex flex-col justify-between gap-2 p-2 pt-0 max-h-[calc(100vh-60px)]" :class="userStore.user?.role === 'student' ? 'relative' : ''">
            <div v-if="userStore.user?.role === 'student' && chatStore.chatInfo?.teacherId" class="absolute right-0 mr-2 mt-2 flex flex-col items-end gap-2">
                <div class="w-fit bg-white rounded-full flex items-center">
                    <button v-if="showChangeButton" class="h-9 px-3 flex items-center border-r border-neutral-200" @click="showChangeModal = true, showChangeButton = !showChangeButton">
                        <span class="text-sm">Cambiar profesor</span>
                    </button>
                    <button class="p-2" @click="showChangeButton = !showChangeButton">
                        <RefreshCw class="text-black" :size="20" />
                    </button>
                </div>
                <div class="w-fit bg-white rounded-full flex items-center">
                    <button v-if="showRateButton" class="h-9 px-3 flex items-center border-r border-neutral-200" @click="showRateModal = true, showRateButton = !showRateButton">
                        <span class="text-sm">Calificar profesor</span>
                    </button>
                    <button class="p-2" @click="showRateButton = !showRateButton">
                        <Star class="text-black" :size="20" />
                    </button>
                </div>
            </div>
            <div :class="chatStore.loading || chatStore.messages.length === 0 ? 'overflow-hidden h-full' : 'overflow-y-auto mt-auto'" class="flex flex-col">
                <div id="container" :class="chatStore.loading || chatStore.messages.length === 0 ? 'items-center justify-center h-full' : 'justify-end'" class="flex flex-col gap-5 pt-2">
                    <div v-if="chatStore.loading" class="flex flex-col gap-2 items-center justify-center w-full text-neutral-700">
                        <LoaderCircle class="animate-spin" size="32" />
                        <span class="font-medium text-lg max-w-64">Cargando mensajes...</span>
                    </div>
                    <EmptyState v-if="!chatStore.loading && chatStore.messages.length === 0" title="Todavía no hay mensajes" description="Escribe tu duda y un profesor te responderá pronto." icon="MailX" />
                    <div v-else v-for="(message, index) in chatStore.messages" :key="index" class="flex gap-2">
                        <div :class="message.sender.role === 'student' ? 'bg-libelo-500' : 'bg-orange-600'" class="flex items-center justify-center size-10 rounded-full text-white flex-shrink-0">
                            <UserAvatar size="10" :orange="message.sender.role === 'teacher'" :user-letter="message.sender.displayName?.charAt(0) || '?'" />
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

        <ChangeModal :show-modal="showChangeModal" @close="showChangeModal = false" />
        <RateModal :show-modal="showRateModal" @close="showRateModal = false" />
    </BaseBody>
</template>

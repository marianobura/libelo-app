<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import StudentCard from '@/components/Subject/StudentCard.vue';
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import SubjectBanner from '@/components/SubjectBanner.vue';
import BaseTitle from '@/components/BaseTitle.vue';
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';
import EmptyState from '@/components/EmptyState.vue';
import { LoaderCircle } from 'lucide-vue-next';

const route = useRoute();
const currentSubject = computed(() => Object.keys(userStore.user?.preferredSubjects)[route.params.id]);
const userStore = useUserStore();
const allChats = ref([]);
const loading = ref(false);
const activeTab = ref('pending');

const fetchChats = async () => {
    loading.value = true;
    try {
        const apiUrl = new URL('/api/chats/', process.env.VUE_APP_API_URL);
        const response = await axios.get(apiUrl.toString());

        if (response.data?.data) {
            allChats.value = response.data.data;
        }
    } catch (error) {
        console.error('Error al obtener los chats:', error);
    } finally {
        loading.value = false;
    }
};

const now = new Date();
const nowDate = now.toISOString().split('T')[0];
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDate = yesterday.toISOString().split('T')[0];

const formatDateTime = (timestamp) => {
    if (!timestamp) return { date: 'N/A', hour: 'N/A' };

    const date = new Date(timestamp);
    const messageDate = date.toISOString().split('T')[0];

    const formattedDate = messageDate === nowDate ? 'Hoy' : messageDate === yesterdayDate ? 'Ayer' : new Intl.DateTimeFormat('es-ES', { dateStyle: 'short' }).format(date);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedHour = `${hours}:${minutes}`;

    return { date: formattedDate, hour: formattedHour };
};

const filteredBranches = computed(() => {
    return userStore.user?.preferredSubjects?.[currentSubject.value] ?? [];
});

const sortedChats = computed(() => {
    return allChats.value
        .filter(chat => filteredBranches.value.includes(chat.subjectName) &&
            (chat.teacherId === null || chat.teacherId._id === userStore.user._id))
        .map(chat => {
            const lastMessage = chat.messages.length ? chat.messages[chat.messages.length - 1] : null;
            return {
                ...chat,
                lastMessageText: lastMessage?.message || 'Sin mensajes',
                lastMessageTime: formatDateTime(lastMessage?.timestamp),
                lastMessageTimestamp: lastMessage?.timestamp ? new Date(lastMessage.timestamp).getTime() : 0
            };
        })
        .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
});

const pendingChats = computed(() => {
    return sortedChats.value.filter(chat => chat.teacherId === null);
});

const activeChats = computed(() => {
    return sortedChats.value.filter(chat => chat.teacherId?._id === userStore.user._id);
});

const groupedPendingChats = computed(() => {
    return pendingChats.value.reduce((acc, chat) => {
        const subject = chat.subjectName;
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(chat);
        return acc;
    }, {});
});

const groupedActiveChats = computed(() => {
    return activeChats.value.reduce((acc, chat) => {
        const subject = chat.subjectName;
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(chat);
        return acc;
    }, {});
});

const setTab = (tab) => {
    activeTab.value = tab;
};

onMounted(fetchChats);
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Gestión de chats" description="Revisa los chats pendientes y los que ya estás atendiendo.">
                <div class="grid grid-cols-2 gap-2">
                    <button class="w-full h-8 flex items-center justify-center rounded-xl transition-all duration-200" :class="activeTab === 'pending' ? 'bg-libelo-500 text-white' : 'border border-neutral-300 text-neutral-700'" @click="setTab('pending')">Pendientes ({{ pendingChats.length }})</button>
                    <button class="w-full h-8 flex items-center justify-center rounded-xl transition-all duration-200" :class="activeTab === 'active' ? 'bg-libelo-500 text-white' : 'border border-neutral-300 text-neutral-700'" @click="setTab('active')">Activos ({{ activeChats.length }})</button>
                </div>
                <div v-if="activeTab === 'pending'" class="flex flex-col gap-2">
                    <div v-if="pendingChats.length === 0 && loading" class="flex justify-center mt-12 w-full">
                        <LoaderCircle class="animate-spin text-libelo-500" size="32" />
                    </div>
                    <div v-else-if="pendingChats.length === 0" class="bg-neutral-300 p-4 flex items-center justify-center rounded-xl">
                        <EmptyState title="Todavía no hay chats pendientes" description="Aparecerán aquí cuando alguien necesite tu asistencia." icon="MailX" />
                    </div>
                    <template v-else>
                        <div v-for="(chats, subject) in groupedPendingChats" :key="'pending-' + subject" class="flex flex-col w-full bg-neutral-300 rounded-xl overflow-hidden">
                            <span class="font-semibold p-2">{{ subject }}</span>
                            <hr class="w-full border-neutral-500" />
                            <div class="flex flex-col divide-y divide-neutral-400">
                                <StudentCard v-for="chat in chats" :key="chat._id" :link-to="`/subject/${chat.subjectId}/chat`" color="red" :student="{ name: chat.studentId.displayName, message: chat.lastMessageText, subjectName: chat.subjectName, ...chat.lastMessageTime }" />
                            </div>
                        </div>
                    </template>
                </div>
                <div v-if="activeTab === 'active'" class="flex flex-col gap-2">
                    <div v-if="activeChats.length === 0 && loading" class="flex justify-center mt-12 w-full">
                        <LoaderCircle class="animate-spin text-libelo-500" size="32" />
                    </div>
                    <div v-else-if="activeChats.length === 0" class="bg-neutral-300 p-4 flex items-center justify-center rounded-xl">
                        <EmptyState title="Todavía no hay chats activos" description="Aparecerán aquí cuando respondas un chat pendiente." icon="MailX" />
                    </div>
                    <template v-else>
                        <div v-for="(chats, subject) in groupedActiveChats" :key="'active-' + subject" class="flex flex-col w-full bg-neutral-300 rounded-xl overflow-hidden">
                            <span class="font-semibold p-2">{{ subject }}</span>
                            <hr class="w-full border-neutral-500" />
                            <div class="flex flex-col divide-y divide-neutral-400">
                                <StudentCard v-for="chat in chats" :key="chat._id" :link-to="`/subject/${chat.subjectId}/chat`" color="green" :student="{ name: chat.studentId.displayName, message: chat.lastMessageText, subjectName: chat.subjectName, ...chat.lastMessageTime }" />
                            </div>
                        </div>
                    </template>
                </div>
            </BaseTitle>
        </div>
    </BaseBody>
</template>
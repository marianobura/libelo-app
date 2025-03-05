<script setup>
/* eslint-disable */
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import StudentCard from '@/components/Subject/StudentCard.vue';
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import SubjectBanner from '@/components/SubjectBanner.vue';
import BaseTitle from '@/components/BaseTitle.vue';
import { MailX } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentSubject = computed(() => Object.keys(userStore.user?.preferredSubjects)[route.params.id]);
const userStore = useUserStore();
const allChats = ref([]);
const loading = ref(false);

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
                lastMessageTimestamp: lastMessage?.timestamp ? new Date(lastMessage.timestamp).getTime() : 0,
                studentName: chat.studentId ? chat.studentId.displayName : 'Estudiante desconocido'
            };
        })
        .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
});


const groupedChats = computed(() => {
    const groups = sortedChats.value.reduce((acc, chat) => {
        const subject = chat.subjectName;
        if (!acc[subject]) {
            acc[subject] = [];
        }
        acc[subject].push(chat);
        return acc;
    }, {});

    return groups;
});

onMounted(fetchChats);
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Alumnos que te solicitaron" description="Estos son los alumnos que te solicitaron como mentor.">
                <div v-if="sortedChats.length === 0" class="w-full flex flex-col bg-neutral-300 rounded-xl overflow-hidden">
                    <div class="h-48 flex flex-col items-center justify-center gap-2 p-2 text-neutral-700">
                        <MailX size="32" />
                        <span class="text-center font-medium border-b border-neutral-300 pb-2">No hay chats disponibles</span>
                    </div>
                </div>
                <div v-else class="flex flex-col gap-2">
                    <div v-for="(chats, subject) in groupedChats" :key="subject" class="flex flex-col w-full bg-neutral-300 rounded-xl overflow-hidden">
                        <span class="font-semibold p-2">{{ subject }}</span>
                        <hr class="w-full border-neutral-500">
                        <div class="flex flex-col divide-y divide-neutral-400">
                            <StudentCard v-for="chat in chats" :key="chat._id" :link-to="`/subject/${chat.subjectId}/chat`" :color="chat.teacherId === null ? 'red' : 'green'"
                            :student="{
                                    name: chat.studentName,
                                    message: chat.lastMessageText,
                                    subjectName: chat.subjectName,
                                    ...chat.lastMessageTime
                                }"
                            />

                        </div>
                    </div>
                </div>
            </BaseTitle>
        </div>
    </BaseBody>
</template>

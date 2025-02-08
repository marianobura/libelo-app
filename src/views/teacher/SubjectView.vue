<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import StudentCard from '@/components/Subject/StudentCard.vue';
import SubjectData from '@/assets/subjects.json'
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import SubjectBanner from '@/components/SubjectBanner.vue';
import BaseTitle from '@/components/BaseTitle.vue';
import { MailX, User } from 'lucide-vue-next';

const userStore = useUserStore();
const allChats = ref([]);
const loading = ref(false);

const teacherSubjects = computed(() => 
    userStore.user?.preferredSubjects?.flatMap(subject => SubjectData.subjects[subject]) || []
);

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

const sortedChats = computed(() => {
    return allChats.value
        .filter(chat => teacherSubjects.value.includes(chat.subjectName))
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

onMounted(fetchChats);
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Alumnos que te solicitaron" description="Estos son los alumnos que te solicitaron como mentor.">
                <div class="w-full flex flex-col bg-neutral-300 rounded-xl overflow-hidden">
                    <div class="flex items-center gap-2 pb-2 border-b border-neutral-400 m-2 mb-0">
                        <User :size="20" />
                        <p class="font-semibold">Selecciona un alumno</p>
                    </div>
                    <div v-if="sortedChats.length === 0" class="h-48 flex flex-col items-center justify-center gap-2 p-2 text-neutral-700">
                        <MailX size="32" />
                        <span class="text-center font-medium border-b border-neutral-300 pb-2">No hay chats disponibles</span>
                    </div>
                    <div v-else class="flex flex-col w-full">
                        <StudentCard v-for="chat in sortedChats" :key="chat._id" :link-to="`/subject/${chat.subjectId}/chat`" :student="{
                            name: chat.studentId.displayName,
                            message: chat.lastMessageText,
                            ...chat.lastMessageTime }"
                        />
                    </div>
                </div>
            </BaseTitle>
        </div>
    </BaseBody>
</template>

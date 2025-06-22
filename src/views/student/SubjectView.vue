<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import BaseCard from "@/components/Subject/BaseCard.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { BookOpenCheck, Bot, CalendarDays, Goal, NotebookPen, Trash2, UserRound } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import { ref, onMounted } from "vue";
import DeleteModal from "@/components/Subject/DeleteModal.vue";
import CoursesModal from "@/components/Subject/CoursesModal.vue";
import { useSubjectStore } from "@/stores/subjectStore";
import { useUserStore } from "@/stores/userStore";
import { goTo } from "@/router";

const subjectStore = useSubjectStore();
const userStore = useUserStore();
const route = useRoute();
const showModalCourses = ref(false);
const showModalDelete = ref(false);

const path = route.params.id;

onMounted(async () => {
    await subjectStore.fetchSubject(path);
})
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Opciones de chat" description="Elige entre asistencia inmediata de IA o asesoramiento experto de mentores.">
                <div class="grid grid-cols-2 gap-2">
                    <BaseCard :link-to="`/student/subject/${path}/chat/fast`" description="Realiza una consulta instantánea." :icon="Bot" chat />
                    <BaseCard :link-to="`/subject/${path}/chat`" description="Habla con un experto y resuelve tus dudas." :icon="UserRound" chat />
                </div>
            </BaseTitle>

            <BaseTitle title="Progreso y planificación" description="Gestiona tus sesiones, evalúa tu avance y mejora con ejercicios prácticos.">
                <div class="grid grid-cols-2 gap-2">
                    <BaseCard :link-to="`/student/subject/${path}/objectives`" description="Establece y sigue tus metas de aprendizaje." :icon="Goal" />
                    <BaseCard v-if="userStore.user.google.isGoogleLinked" :link-to="`/student/subject/${path}/calendar`" description="Planifica y agenda tus próximas sesiones." :icon="CalendarDays" />
                    <BaseCard v-else description="Planifica y agenda tus próximas sesiones." :icon="CalendarDays" @click="goTo('/settings/google')" />
                    <BaseCard v-if="subjectStore.subject?.classroomName" :link-to="`/student/subject/${path}/work`" description="Revisa y evalúa tu progreso académico." :icon="BookOpenCheck" />
                    <BaseCard v-else description="Revisa y evalúa tu progreso académico." :icon="BookOpenCheck" @click="showModalCourses = true" />
                    <BaseCard description="Practica con ejercicios y mejora tus habilidades." :icon="NotebookPen" disabled />
                </div>
            </BaseTitle>

            <div class="grid grid-cols-[1fr_48px] gap-2">
                <BaseButton @click="showModalCourses = true">{{ subjectStore.subject?.classroomName ? 'Cambiar materia de Classroom' : 'Vincular materia con Classroom' }}</BaseButton>
                <BaseButton danger class="flex items-center justify-center" @click="showModalDelete = true"><Trash2 size="20" /></BaseButton>
            </div>

        </div>
        <CoursesModal :show-modal="showModalCourses" @close="showModalCourses = false" />
        <DeleteModal :show-modal="showModalDelete" @close="showModalDelete = false" />
    </BaseBody>
</template>
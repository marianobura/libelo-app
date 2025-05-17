<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import BaseCard from "@/components/Subject/BaseCard.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { BookOpenCheck, Bot, CalendarDays, Goal, NotebookPen, Trash2, UserRound } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import { ref } from "vue";
import DeleteModal from "@/components/Subject/DeleteModal.vue";
import CoursesModal from "@/components/Subject/CoursesModal.vue";

const route = useRoute();
const showModalCourses = ref(false);
const showModalDelete = ref(false);

const path = route.params.id;
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Opciones de chat" description="Elige entre asistencia inmediata de IA o asesoramiento experto de mentores.">
                <div class="grid grid-cols-2 gap-2">
                    <BaseCard :link-to="`/student/subject/${path}/chat/fast`" title="Rápido" description="Realiza una consulta instantánea." :icon="Bot" />
                    <BaseCard :link-to="`/subject/${path}/chat`" title="Profesional" description="Habla con un experto y resuelve tus dudas." :icon="UserRound" />
                </div>
            </BaseTitle>

            <BaseTitle title="Progreso y planificación" description="Gestiona tus sesiones, evalúa tu avance y mejora con ejercicios prácticos.">
                <div class="grid grid-cols-2 gap-2">
                    <BaseCard :link-to="`/student/subject/${path}/objectives`" title="Objetivos" description="Establece y sigue tus metas de aprendizaje." :color="false" :icon="Goal" />
                    <BaseCard :link-to="`/student/subject/${path}/calendar`" title="Calendario" description="Planifica y agenda tus próximas sesiones." :color="false" :icon="CalendarDays" />
                    <BaseCard :link-to="`/student/subject/${path}/work`" title="Classroom" description="Revisa y evalúa tu progreso académico." :color="false" :icon="BookOpenCheck" />
                    <BaseCard link-to="/student" title="Desafíos" description="Practica con ejercicios y mejora tus habilidades." :color="false" :icon="NotebookPen" />
                </div>
            </BaseTitle>

            <div class="grid grid-cols-[1fr_48px] gap-2">
                <BaseButton @click="showModalCourses = true">Vincular materia con Classroom</BaseButton>
                <BaseButton danger class="flex items-center justify-center" @click="showModalDelete = true"><Trash2 size="20" /></BaseButton>
            </div>

        </div>
        <CoursesModal :show-modal="showModalCourses" @close="showModalCourses = false" />
        <DeleteModal :show-modal="showModalDelete" @close="showModalDelete = false" />
    </BaseBody>
</template>
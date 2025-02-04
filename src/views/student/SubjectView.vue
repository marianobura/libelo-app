<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import BaseCard from "@/components/Subject/BaseCard.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { BookOpenCheck, Bot, CalendarDays, Goal, NotebookPen, UserRound } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';

const route = useRoute();

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
                    <BaseCard :link-to="`/student/subject/${path}/objective`" title="Objetivos" description="Establece y sigue tus metas de aprendizaje." :color="false" :icon="Goal" />
                    <BaseCard :link-to="`/student/subject/${path}/calendar`" title="Calendario" description="Planifica y agenda tus próximas sesiones." :color="false" :icon="CalendarDays" />
                    <BaseCard :link-to="`/student/subject/${path}/work`" title="Trabajos" description="Revisa y evalúa tu progreso académico." :color="false" :icon="BookOpenCheck" />
                    <BaseCard link-to="/student" title="Ejercicios" description="Practica con ejercicios y mejora tus habilidades." :color="false" :icon="NotebookPen" />
                </div>
            </BaseTitle>

            <BaseButton primary path="/settings">Configuración</BaseButton>
        </div>
    </BaseBody>
</template>
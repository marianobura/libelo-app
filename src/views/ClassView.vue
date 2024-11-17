<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import BaseCard from "@/components/Class/BaseCard.vue";
import { BookOpenCheck, Bot, CalendarDays, Goal, NotebookPen, UserRound } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();

const subjectData = ref(null);

const fetchSubjectData = async () => {
    try {
        const apiUrl = new URL(`/subjects`, process.env.VUE_APP_API_URL);
        const response = await axios.get(apiUrl.toString());
        const subjects = response.data.data;
        subjectData.value = subjects.find(subject => subject._id === route.params.id);
    } catch (error) {
        console.error("Error al obtener la información de la materia:", error);
    }
};

onMounted(() => {
    fetchSubjectData();
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Materia" />
        <div class="flex flex-col gap-4 p-2">
            <div class="flex flex-col justify-end p-3 h-28 w-full bg-red-800 rounded-xl">
                <div class="text-white font-semibold text-xl uppercase">{{ subjectData?.name }}</div>
            </div>
            <BaseTitle title="Opciones de chat" description="Elige entre asistencia inmediata de IA o asesoramiento experto de mentores.">
                <div class="grid grid-cols-2 gap-2">
                    <BaseCard link-to="/class/chat/fast" title="Chat rápido" description="Realiza una consulta instantánea." :icon="Bot" />
                    <BaseCard title="Chat profesional" description="Habla con un experto y resuelve tus dudas." :icon="UserRound" />
                </div>
            </BaseTitle>

            <BaseTitle title="Progreso y planificación" description="Gestiona tus sesiones, evalúa tu avance y mejora con ejercicios prácticos.">
                <div class="grid grid-cols-2 gap-2">
                    <BaseCard title="Objetivos" description="Establece y sigue tus metas de aprendizaje." :color="false" :icon="Goal" />
                    <BaseCard link-to="/class/calendar" title="Calendario" description="Planifica y agenda tus próximas sesiones." :color="false" :icon="CalendarDays" />
                    <BaseCard link-to="/class/work" title="Trabajos" description="Revisa y evalúa tu progreso académico." :color="false" :icon="BookOpenCheck" />
                    <BaseCard title="Ejercicios" description="Practica con ejercicios y mejora tus habilidades." :color="false" :icon="NotebookPen" />
                </div>
            </BaseTitle>

            <BaseButton primary content="Configuración" path="/settings" />
        </div>
    </BaseBody>
</template>
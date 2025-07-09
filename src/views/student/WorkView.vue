<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import SubjectBanner from "@/components/Subject/SubjectBanner.vue";
import StatusCard from "@/components/Work/StatusCard.vue";
import PendingCard from "@/components/Work/PendingCard.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useSubjectStore } from "@/stores/subjectStore";
import { useUserStore } from "@/stores/userStore";
import { useWorkStore } from "@/stores/workStore";
import { CheckCircle, LoaderCircle } from "lucide-vue-next";

const route = useRoute();
const path = route.params.id;
const subjectStore = useSubjectStore();
const userStore = useUserStore();
const workStore = useWorkStore();

const loading = ref(true);
const worksPending = ref([]);
const worksCompleted = ref([]);
const showPending = ref(true);
const showCompleted = ref(false);

const formatDueDate = (dueDate, dueTime) => {
    if (!dueDate || !dueTime) return 'Sin fecha';

    const date = new Date(Date.UTC(
        dueDate.year,
        dueDate.month - 1,
        dueDate.day,
        dueTime.hours || 0,
        dueTime.minutes || 0
    ));

    return date.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
        hour12: false
    }).replace(',', ' |');
}

const getCompletedDescription = (course) => {
    let state = '';

    switch (course.submissionState) {
        case 'TURNED_IN':
            state = 'Entregado';
            break;
        case 'RETURNED':
            state = 'Devuelto';
            break;
        default:
            state = 'Estado desconocido';
    }

    if (course.assignedGrade !== undefined) {
        state += ` | Nota: ${course.assignedGrade}`;
    }

    return `${state}`;
};

onMounted(async () => {
    await subjectStore.fetchSubject(path);
    const subject = subjectStore.subject;
    const classroomId = subject.classroomId;

    const cached = workStore.getWorks(classroomId);
    if (cached.loaded) {
        worksPending.value = cached.pending;
        worksCompleted.value = cached.completed;
        loading.value = false;
        return;
    }

    try {
        const res = await fetch(`https://classroom.googleapis.com/v1/courses/${classroomId}/courseWork/`, {
            headers: {
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            }
        });
        const data = await res.json();
        const courseWorks = data.courseWork || [];

        const pending = [];
        const completed = [];

        for (let courseWork of courseWorks) {
            const id = courseWork.id;
            const response = await fetch(`https://classroom.googleapis.com/v1/courses/${classroomId}/courseWork/${id}/studentSubmissions/`, {
                headers: {
                    Authorization: `Bearer ${userStore?.user.google.accessToken}`
                }
            });
            const submissionData = await response.json();

            if (submissionData.studentSubmissions?.length > 0) {
                for (const submission of submissionData.studentSubmissions) {
                    const combined = {
                        ...courseWork,
                        submissionState: submission.state,
                        assignedGrade: submission.assignedGrade,
                        submission: submission
                    };

                    if (submission.state === "TURNED_IN" || submission.state === "RETURNED") {
                        completed.push(combined);
                    } else if (submission.state === "NEW" || submission.state === "CREATED" || submission.state === "RECLAIMED_BY_STUDENT") {
                        pending.push(combined);
                    }
                }
            }
        }

        worksPending.value = pending;
        worksCompleted.value = completed;
        workStore.setWorks(classroomId, pending, completed);
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Trabajos" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Gestión de trabajos" description="Supervisa tu progreso revisando los trabajos y celebra tus logros con los trabajos completados.">
                <div class="grid grid-cols-2 gap-2 w-full">
                    <StatusCard @click="{ showPending = true; showCompleted = false }" :count="loading ? 0 : worksPending.length" description="Pendientes" :class="showPending ? 'bg-neutral-300' : ''" />
                    <StatusCard @click="{ showPending = false; showCompleted = true }" :count="loading ? 0 : worksCompleted.length" description="Completados" :class="showCompleted ? 'bg-neutral-300' : ''" />
                </div>
            </BaseTitle>
            <BaseTitle v-if="showPending" title="Trabajos pendientes" description="Los trabajos están conectados con Classroom.">
                <div v-if="loading" class="w-full mt-8 flex items-center justify-center size-8 text-libelo-500">
                    <LoaderCircle class="animate-spin" :size="32" />
                </div>
                <div v-if="!loading && worksPending.length === 0" class="px-4 py-6 text-center rounded-xl bg-libelo-50 text-libelo-500 border border-libelo-200">
                    <CheckCircle class="mx-auto mb-2" :size="32" />
                    <h3 class="text-lg font-semibold">¡Estás al día!</h3>
                    <p class="text-sm mt-1">No hay tareas pendientes por el momento.</p>
                </div>
                <PendingCard v-for="(course, index) in worksPending" :link="course.alternateLink" :key="course.id" :num="index + 1" :title="course.title" :description="'Fecha de entrega: ' + formatDueDate(course.dueDate, course.dueTime)" :color="subjectStore.subject.color" />
            </BaseTitle>
            <BaseTitle v-if="showCompleted" title="Trabajos completados" description="Los trabajos están conectados con Classroom.">
                <div v-if="loading" class="w-full mt-8 flex items-center justify-center size-8 text-libelo-500">
                    <LoaderCircle class="animate-spin" :size="32" />
                </div>
                <div v-if="!loading && worksCompleted.length === 0" class="px-4 py-6 text-center rounded-xl bg-libelo-50 text-libelo-500 border border-libelo-200">
                    <CheckCircle class="mx-auto mb-2" :size="32" />
                    <h3 class="text-lg font-semibold">¡Estás al día!</h3>
                    <p class="text-sm mt-1">No hay tareas pendientes por el momento.</p>
                </div>
                <PendingCard v-for="(course, index) in worksCompleted" :link="course.alternateLink" :key="course.id" :num="index + 1" :title="course.title" :description="getCompletedDescription(course)" :color="subjectStore.subject.color" />
            </BaseTitle>
        </div>
    </BaseBody>
</template>
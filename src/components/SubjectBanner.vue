<script setup>
import { computed, watchEffect } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { useRoute } from "vue-router";

const route = useRoute();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

watchEffect(() => {
    if (route.params.id && userStore.user) {
        if (userStore.user?.role === 'student') {
            subjectStore.fetchSubject(route.params.id);
        } else if (userStore.user?.role === 'teacher') {
            Object.keys(userStore.user?.preferredSubjects)[route.params.id];
        }
    }
});

const subjectName = computed(() => {
    if (userStore.user) {
        if (userStore.user?.role === 'student') {
            return subjectStore.subject?.name ?? "Materia";
        } else if (userStore.user?.role === 'teacher') {
            return Object.keys(userStore.user?.preferredSubjects)[route.params.id] ?? "Materia";
        }
    }
    return "Materia";
});
</script>

<template>
    <div class="flex items-end p-3 h-28 w-full bg-red-800 rounded-xl">
        <div class="text-white font-semibold text-xl uppercase break-all line-clamp-1">
            {{ subjectStore.loading ? "Cargando..." : subjectName }}
        </div>
    </div>
</template>
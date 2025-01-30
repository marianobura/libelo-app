<script setup>
import { computed, watchEffect } from "vue";
import { useSubjectStore } from "@/stores/subjectStore";
import { useRoute } from "vue-router";

const route = useRoute();
const subjectStore = useSubjectStore();

watchEffect(() => {
    if (route.params.id) {
        subjectStore.fetchSubject(route.params.id);
    }
});

const subjectName = computed(() => subjectStore.subjectData?.name || "Materia");
</script>

<template>
    <div class="flex items-end p-3 h-28 w-full bg-red-800 rounded-xl">
        <div class="text-white font-semibold text-xl uppercase break-all line-clamp-1">
            {{ subjectStore.loading ? "Cargando..." : subjectName }}
        </div>
    </div>
</template>

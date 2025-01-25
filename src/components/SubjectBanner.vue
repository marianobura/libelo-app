<script setup>
import { onMounted, ref } from "vue";
import { useSubjectData } from "@/services/subjectData"; 

const { subjectData, fetchSubjectData } = useSubjectData();

const loading = ref(true);

onMounted(async () => {
    await fetchSubjectData();
    loading.value = false;
});
</script>

<template>
    <div class="flex items-end p-3 h-28 w-full bg-red-800 rounded-xl">
        <div class="text-white font-semibold text-xl uppercase break-all line-clamp-1">{{ loading ? 'Cargando...' : subjectData?.name || 'Materia' }}</div>
    </div>
</template>

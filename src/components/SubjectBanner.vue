<script setup>
import { onMounted } from "vue";
import { useSubjectData } from "@/services/subjectData"; 

const { subjectData, fetchSubjectData } = useSubjectData();

onMounted(() => {
    fetchSubjectData();
});
</script>

<template>
    <div class="flex items-end p-3 h-28 w-full bg-red-800 rounded-xl">
        <div class="text-white font-semibold text-xl uppercase break-all line-clamp-1">{{ subjectData?.name }}</div>
    </div>
</template>

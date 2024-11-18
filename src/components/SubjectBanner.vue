<script setup>
import { onMounted } from "vue";
import { useSubjectData } from "@/services/subjectData"; 

const { subjectData, fetchSubjectData } = useSubjectData();

onMounted(() => {
    fetchSubjectData();
});
</script>

<template>
    <div class="flex flex-col justify-end p-3 h-28 w-full bg-red-800 rounded-xl">
        <div class="text-white font-semibold text-xl uppercase">{{ subjectData?.name }}</div>
    </div>
</template>
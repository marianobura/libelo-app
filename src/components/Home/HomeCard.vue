<script setup>
import { defineProps } from "vue";

defineProps({
    content: String,
});
</script>

<template>
    <div class="flex items-center justify-center w-full h-20 p-4 rounded-xl bg-red-800 uppercase">
        <div class="line-clamp-2 text-center break-words">{{ content }}</div>
    </div>
</template>
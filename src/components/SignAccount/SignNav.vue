<script setup>
import { defineProps } from 'vue';

defineProps({
    title: String,
    description: String
});
</script>

<template>
    <div class="flex items-center justify-center w-full h-32 bg-libelo-500 rounded-b-xl">
        <img src="/img/logotipo.png" alt="Logotipo de Libelo">
    </div>
    <div class="flex flex-col px-2 my-3">
        <h1 class="font-semibold text-2xl">{{ title }}</h1>
        <p class="text-neutral-700">{{ description }}</p>
    </div>
</template>
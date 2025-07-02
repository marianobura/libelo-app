<script setup>
import defineProps from 'vue';

defineProps({
    num: Number,
    title: String,
    description: String,
    link: String,
    color: String
})
</script>

<template>
    <a class="bg-white w-full p-2 rounded-xl" :href="link" target="_blank">
        <div class="flex gap-2 items-center">
            <div class="flex items-center justify-center size-6 rounded-lg text-white text-sm font-semibold shrink-0 mb-auto" :style="{ backgroundImage: `linear-gradient(to bottom, ${color})` }">{{ num }}</div>
            <div class="flex flex-col shrink-1">
                <div class="font-semibold">{{ title }}</div>
                <div class="text-sm text-neutral-700">{{ description }}</div>
            </div>
        </div>
    </a>
</template>
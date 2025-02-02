<script setup>
import { defineProps } from 'vue';
import { goTo } from '@/router';

defineProps({
    size: {
        type: String,
        default: "12"
    },
    userLetter: {
        type: String,
        default: "?"
    },
    orange: {
        type: Boolean,
        default: false
    },
});
</script>

<template>
    <div @click="goTo('/settings')" class="flex items-center justify-center text-white rounded-full font-semibold" :class="[`size-${size}`, orange ? 'bg-orange-600' : 'bg-libelo-500']">{{ userLetter }}</div>
</template>

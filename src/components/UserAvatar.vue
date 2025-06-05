<script setup>
import { defineProps, computed } from 'vue';
import { goTo } from '@/router';
import { useUserStore } from '@/stores/userStore';

defineProps({
    size: {
        type: String,
        default: "12"
    },
    orange: {
        type: Boolean,
        default: false
    }
});

const userStore = useUserStore();

const userLetter = computed(() => {
    return userStore.user?.displayName?.charAt(0).toUpperCase() || '';
});
</script>

<template>
    <div @click="goTo('/settings')" class="flex items-center justify-center text-white rounded-full font-semibold" :class="[`size-${size}`, orange ? 'bg-orange-600' : 'bg-libelo-500']">{{ userLetter }}</div>
</template>

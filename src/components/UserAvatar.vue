<script setup>
import { defineProps, computed } from 'vue';
import { goTo } from '@/router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

defineProps({
    size: {
        type: String,
        default: "12"
    }
});

const avatarLetter = computed(() => userStore.user?.displayName?.charAt(0) || '');
</script>

<template>
    <div v-if="!userStore.user" class="animate-pulse flex items-center justify-center bg-libelo-500 text-white rounded-full font-semibold" :class="`size-${size}`"></div>
    <div v-else @click="goTo('/settings')" class="flex items-center justify-center bg-libelo-500 text-white rounded-full font-semibold" :class="`size-${size}`">{{ avatarLetter }}</div>
</template>
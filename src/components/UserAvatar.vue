<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { goTo } from '@/router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const loading = ref(true);

defineProps({
    size: {
        type: String,
        default: "12"
    }
});

onMounted(async () => {
    await userStore.fetchUser();
    loading.value = false;
});
</script>

<template>
    <div v-if="loading" class="animate-pulse flex items-center justify-center bg-libelo-500 text-white rounded-full font-semibold" :class="`size-${size}`"></div>
    <div v-else @click="goTo('/settings')" class="flex items-center justify-center bg-libelo-500 text-white rounded-full font-semibold" :class="`size-${size}`">{{ userStore.user?.displayName?.charAt(0) }}</div>
</template>
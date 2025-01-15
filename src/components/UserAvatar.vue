<script setup>
import { defineProps } from 'vue';
import { goTo } from '@/router';
import { useUserStore } from '../stores/userStore';
import { onMounted } from 'vue';

const userStore = useUserStore();

defineProps({
    size: {
        type: String,
        default: "12"
    }
});

onMounted(async () => {
    await userStore.fetchUser();
});
</script>

<template>
    <div @click="goTo('/settings')" class="flex items-center justify-center bg-libelo-500 text-white rounded-full font-semibold" :class="`size-${size}`">
        {{ userStore.user?.displayName?.charAt(0) }}
    </div>
</template>
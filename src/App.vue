<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from './stores/userStore';

const userStore = useUserStore();

onMounted(() => {
    userStore.fetchUser();

    const preventReload = (e) => {
        if (e.touches[0].clientY < 50) {
            e.preventDefault();
        }
    };

    window.addEventListener('touchmove', preventReload, { passive: false });

    onBeforeUnmount(() => {
        window.removeEventListener('touchmove', preventReload);
    });
});
</script>

<template>
    <router-view />
</template>

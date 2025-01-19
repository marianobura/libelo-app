<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';

const userStore = useUserStore();

onMounted(() => {
    userStore.fetchUser();
});
</script>

<template>
    <router-view />
</template>
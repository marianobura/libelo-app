<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import { useSubjectStore } from './stores/subjectStore';

const userStore = useUserStore();
const subjectStore = useSubjectStore();

onMounted(() => {
    userStore.fetchUser();
    subjectStore.fetchSubject();
});
</script>

<template>
    <router-view />
</template>
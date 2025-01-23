<script setup>
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';

const userStore = useUserStore();
const loading = ref(true);

onMounted(async () => {
    await userStore.fetchUser();
    loading.value = false;
});
</script>

<template>
    <div class="h-[180px] w-full bg-libelo-500 rounded-xl bg-banner bg-bottom">
        <div class="p-3 flex flex-col text-neutral-100">
            <p v-if="loading">¡Bienvenido!</p>
            <p v-else>¡Bienvenido <span class="text-orange-400 font-semibold">{{ userStore.user?.firstName }}</span>!</p>
            <p class="text-neutral-300 text-sm text-balance">{{ userStore.user?.role === 'student' ? 'Empieza ahora y conecta con mentores expertos en la materia que elijas, ¡ellos te ayudarán!' : 'Comparte tu experiencia y ayuda a estudiantes a alcanzar su máximo potencial.' }}</p>
        </div>
    </div>
</template>
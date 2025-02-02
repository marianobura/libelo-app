<script setup>
import WelcomeSvg from '@/components/Welcome/WelcomeSvg.vue';
import BaseButton from '@/components/BaseButton.vue';
import WelcomeModal from '@/components/Welcome/WelcomeModal.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const showModal = ref(false);
const router = useRouter();

const handleRoleSelection = (role) => {
    router.push({ name: 'register', query: { role } });
};
</script>

<template>
    <div class="grid grid-rows-welcome min-h-full">
        <div class="flex justify-center items-end mb-8">
            <WelcomeSvg />
        </div>
        <div class="flex flex-col justify-between p-2">
            <div class="flex flex-col items-center gap-2 mb-4">
                <h1 class="font-semibold text-2xl">¡Bienvenido a Libelo!</h1>
                <p class="text-neutral-700 text-balance text-center">Estamos encantados de ayudarte a mejorar tu aprendizaje de manera sencilla y eficaz.</p>
            </div>
            <div class="flex flex-col gap-2">
                <BaseButton primary path="/login">Iniciar sesión</BaseButton>
                <BaseButton @click="showModal = true">Crear cuenta</BaseButton>

                <WelcomeModal :show-modal="showModal" @close="showModal = false" @select-role="handleRoleSelection" />
            </div>
        </div>
    </div>
</template>
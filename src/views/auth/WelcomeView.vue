<script setup>
import WelcomeSvg from '@/components/Welcome/WelcomeSvg.vue';
import BaseButton from '@/components/BaseButton.vue';
</script>

<template>
    <div class="grid grid-rows-welcome min-h-full">
        <div class="flex justify-center items-center pb-8 mb-2 bg-libelo-500 relative overflow-hidden">
            <WelcomeSvg class="text-white w-48" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 64" class="w-full h-16 absolute bottom-0" preserveAspectRatio="none">
                <path d="M0,64 Q720,0 1440,64 L1440,64 L0,64 Z" fill="white" />
            </svg>
        </div>
        <div class="flex flex-col justify-between gap-8 p-2">
            <div class="flex flex-col items-center gap-2">
                <h1 class="font-semibold text-2xl">¡Bienvenido a Libelo!</h1>
                <p class="text-neutral-700 text-balance text-center">Estamos encantados de ayudarte a mejorar tu aprendizaje de manera sencilla y eficaz.</p>
            </div>
            <div class="flex flex-col gap-2">
                <BaseButton primary path="/login">Iniciar sesión</BaseButton>
                <BaseButton path="/register">Crear cuenta</BaseButton>
            </div>
        </div>
    </div>
</template>
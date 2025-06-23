<script setup>
import WelcomeSvg from '@/components/Welcome/WelcomeSvg.vue';
import BaseButton from '@/components/BaseButton.vue';
</script>

<template>
    <div class="grid grid-rows-welcome min-h-full">
        <div class="flex justify-center items-end mb-8">
            <WelcomeSvg class="text-libelo-500" />
        </div>
        <div class="flex flex-col justify-between p-2">
            <div class="flex flex-col items-center gap-2 mb-4">
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
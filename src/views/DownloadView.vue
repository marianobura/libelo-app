<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';

const router = useRouter();
let deferredPrompt = null;

const installApp = async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt = null;
    }
};

onMounted(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

    if (isStandalone) {
        const role = localStorage.getItem('role');

        if (role === 'student') {
            router.replace('/student');
        } else if (role === 'teacher') {
            router.replace('/teacher');
        } else {
            router.replace('/choose-role');
        }
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });
});
</script>

<template>
    <div class="w-screen h-screen flex flex-col gap- items-center justify-center p-4">
        <h1 class="text-3xl font-semibold mb-2">Descargar Libelo</h1>
        <p class="text-neutral-700 mb-4 text-center">En Libelo te ofrecemos herramientas para que puedas aprender a tu ritmo con profesionales que te guíen en el camino. Descarga la aplicación en tu dispositivo.</p>
        <BaseButton primary @click="installApp">Descargar aplicación</BaseButton>
    </div>
</template>

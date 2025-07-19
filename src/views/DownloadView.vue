<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { LoaderCircle } from 'lucide-vue-next';

const router = useRouter();
let deferredPrompt = null;

const installing = ref(false);
const installed = ref(false);
const canInstall = ref(false);

const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    deferredPrompt = null;

    if (choiceResult.outcome === 'accepted') {
        installing.value = true;

        setTimeout(() => {
            installing.value = false;
            installed.value = true;
        }, 5000);
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
        canInstall.value = true;
    });
});
</script>

<template>
    <div class="w-screen h-screen flex flex-col items-center justify-center p-4">
        <template v-if="!installing && !installed">
            <h1 class="text-2xl font-semibold mb-2">Descargar Libelo</h1>
            <p class="text-neutral-700 mb-4 text-center">En Libelo te ofrecemos herramientas para que puedas aprender a tu
                ritmo con profesionales que te guíen en el camino. Descarga la aplicación en tu dispositivo.</p>
            <BaseButton primary @click="installApp">Descargar aplicación</BaseButton>
        </template>
        <template v-else-if="installing">
            <div class="flex gap-2 items-center">
                <LoaderCircle class="animate-spin text-libelo-500" :size="32" />
                <h1 class="text-2xl font-semibold mb-2">Instalando...</h1>
            </div>
            <p class="text-neutral-700 mb-4 text-center">Por favor, espera mientras se instala la aplicación.</p>
        </template>
        <template v-if="installed">
            <p>¡La aplicación fue instalada con éxito!</p>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { LoaderCircle } from 'lucide-vue-next';
import WelcomeSvg from '@/components/Welcome/WelcomeSvg.vue';

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
    <div class="w-screen h-dvh grid grid-rows-3">
        <div class="h-full w-full flex items-center justify-center relative bg-libelo-500 row-span-2">
            <WelcomeSvg class="text-white w-40" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 64" class="w-full h-16 absolute bottom-0" preserveAspectRatio="none">
                <path d="M0,64 Q720,0 1440,64 L1440,64 L0,64 Z" fill="white" />
            </svg>
        </div>
        <div class="flex flex-col items-center p-2" :class="!installing && !installed && canInstall ? 'justify-end' : 'justify-center'">
            <template v-if="!canInstall">
                <p class="text-balance text-center text-lg font-semibold">No se puede descargar la aplicación en este dispositivo.</p>
            </template>
            <template v-else-if="canInstall && !installing && !installed">
                <h1 class="text-2xl font-semibold mb-2">Descargar Libelo</h1>
                <p class="text-neutral-700 mb-4 text-center">En Libelo te ofrecemos herramientas para que puedas aprender a tu
                    ritmo con profesionales que te guíen en el camino.</p>
                <BaseButton primary @click="installApp">Descargar aplicación</BaseButton>
            </template>
            <template v-else-if="installing && !installed">
                <div class="flex gap-2 items-center mb-2">
                    <LoaderCircle class="animate-spin text-libelo-500" :size="32" />
                    <h1 class="text-2xl font-semibold">Instalando...</h1>
                </div>
                <p class="text-neutral-700 text-center">Por favor, espera mientras se instala la aplicación.</p>
            </template>
            <template v-if="installed">
                <p class="text-lg mb-2">¡La aplicación fue instalada con éxito!</p>
            </template>
        </div>
    </div>
</template>

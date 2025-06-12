<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';
import axios from 'axios';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import BaseTitle from '@/components/BaseTitle.vue';

const userStore = useUserStore();

const handleTokenFromGoogle = async (accessToken) => {
    try {
        const apiUrl = new URL('/api/users/google-link', process.env.VUE_APP_API_URL);
        const result = await axios.post(apiUrl.toString(), { accessToken, email: userStore.user.email });

        if (result.status === 200) {
            await userStore.fetchUser();
        }
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
};

onMounted(async () => {
    await userStore.fetchUser();
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Google" />
        <div class="flex flex-col gap-4 p-2">
            <div v-if="userStore.user.google.isGoogleLinked" class="flex flex-col gap-4">
                <BaseTitle title="Cuenta vinculada" description="Esta cuenta se encuentra actualmente asociada a la siguiente dirección de correo electrónico de Google:">
                    <div class="border border-neutral-300 bg-neutral-200 py-2 px-3 rounded-xl">
                        <span class="font-semibold text-libelo">{{ userStore.user.google.gmail }}</span>
                    </div>
                </BaseTitle>
                <BaseTitle title="Vincular a otra cuenta" description="Para actualizar o cambiar la vinculación, haga clic en el botón a continuación:">
                </BaseTitle>
            </div>
            <div v-else>
                <BaseTitle title="Cuenta vinculada" description="Esta cuenta no se encuentra vinculada a una cuenta de Google. Para realizar la vinculación, haz clic en el botón a continuación:">
                </BaseTitle>
            </div>
            <GoogleLogin :onTokenReceived="handleTokenFromGoogle" secondary>{{ userStore.user.google.isGoogleLinked ? 'Vincular a otra cuenta' : 'Vincular con Google' }}</GoogleLogin>
        </div>
    </BaseBody>
</template>
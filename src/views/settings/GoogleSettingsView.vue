<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';
import axios from 'axios';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

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
            <div v-if="userStore.user.google.isGoogleLinked" class="flex flex-col gap-2">
                <p>Esta cuenta está asociada a {{ userStore.user.google.gmail }}</p>
            </div>
            <div v-else class="flex flex-col gap-2">
                <p>Esta cuenta no está asociada a ninguna cuenta de Google.</p>
            </div>
            <GoogleLogin :onTokenReceived="handleTokenFromGoogle" secondary>{{ userStore.user.google.isGoogleLinked ? 'Vincular a otra cuenta' : 'Vincular con Google' }}</GoogleLogin>
        </div>
    </BaseBody>
</template>
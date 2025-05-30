<script setup>
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import SignNav from '@/components/SignAccount/SignNav.vue';
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CircleAlert } from "lucide-vue-next";
import BaseBody from '@/components/BaseBody.vue';

const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const errors = ref({
    email: '',
    password: '',
});

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value === '') {
        errors.value.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(email.value)) {
        errors.value.email = 'Introduzca un correo electrónico válido.';
    } else {
        errors.value.email = '';
    }
};

const validatePassword = () => {
    if (password.value === '') {
        errors.value.password = 'La contraseña es obligatoria.';
    } else if (password.value.length < 8) {
        errors.value.password = 'La contraseña debe tener al menos 8 caracteres.';
    } else {
        errors.value.password = '';
    }
};

const validateForm = () => {
    validateEmail();
    validatePassword();
    return !Object.values(errors.value).some((error) => error !== '');
};

const handleLogin = async () => {
    errorMessage.value = '';
    if (!validateForm()) {
        return;
    }

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    errorMessage.value = '';
    try {
        const formattedEmail = email.value.trim().toLowerCase();

        const emailUrl = new URL(`/api/users/email/${formattedEmail}`, process.env.VUE_APP_API_URL);
        const emailResponse = await axios.get(emailUrl.toString());
        const user = emailResponse.data.data;

        if (user.google.isGoogleLinked && !user.password) {
            errorMessage.value = 'Este correo está asociado a una cuenta de Google. Por favor, inicia sesión con Google.';
            loading.value = false;
            return;
        } else {
            const apiUrl = new URL(`/api/users/login`, process.env.VUE_APP_API_URL);
            const response = await axios.post(apiUrl.toString(), {
                email: formattedEmail,
                password: password.value,
            });

            if (response.status === 200) {
                const { token, role } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                if (role === 'student') {
                    router.push('/student');
                } else if (role === 'teacher') {
                    router.push('/teacher');
                } else {
                    router.push('/choose-role');
                }
            }
        }
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.msg;
        } else {
            errorMessage.value = 'Ocurrió un error inesperado.';
        }
    }

    loading.value = false;
};

const handleTokenFromGoogle = async (accessToken) => {
    try {
        const apiUrl = new URL('/api/users/google-login', process.env.VUE_APP_API_URL);
        const result = await axios.post(apiUrl.toString(), { accessToken });

        if (result.status === 200) {
            const { token, role } = result.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            if (role === 'student') {
                router.push('/student');
            } else if (role === 'teacher') {
                router.push('/teacher');
            } else {
                router.push('/choose-role');
            }
        }
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
};
</script>

<template>
    <div class="flex flex-col min-h-full">
        <SignNav title="Iniciar sesión" />
        <BaseBody sign>
            <div class="flex flex-col gap-3">
                <BaseInput identifier="email" placeholder="usuario@email.com" label="Correo electrónico" type="email" v-model="email" :error="!!errors.email" :error-message="errors.email" />
                <BaseInput password reset identifier="password" placeholder="Ingresa tu contraseña" label="Contraseña" type="password" v-model="password" :error="!!errors.password" :error-message="errors.password" />
                <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
                    <CircleAlert :size="16" class="flex-shrink-0 mb-auto mt-0.5" />
                    <span class="text-sm">{{ errorMessage }}</span>
                </div>
                <div class="flex flex-col">
                    <BaseButton @click="handleLogin" primary>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</BaseButton>
                    <div class="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 h-12 w-full">
                        <hr class="w-full border-neutral-300" />
                        <span class="text-neutral-700 text-sm text-center">o inicia sesión con</span>
                        <hr class="w-full border-neutral-300" />
                    </div>
                    <GoogleLogin :onTokenReceived="handleTokenFromGoogle">Continuar con Google</GoogleLogin>
                </div>
            </div>
            <div class="flex items-center justify-center h-12 w-full">
                <p class="text-neutral-700">¿No tienes una cuenta? <router-link to="/register" class="text-libelo-500 font-semibold ml-1">Regístrate ahora</router-link></p>
            </div>
        </BaseBody>
    </div>
</template>
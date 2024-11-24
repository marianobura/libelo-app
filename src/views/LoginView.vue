<script setup>
import axios from 'axios';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import SignNav from '../components/SignAccount/SignNav.vue';
import GoogleLogin from '../components/SignAccount/GoogleLogin.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CircleAlert } from "lucide-vue-next";
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const errors = ref({
    email: '',
    password: '',
});

const handleLogin = async () => {
    const validateEmail = () => {
        if (email.value === '') {
            errors.value.email = 'El correo electrónico es obligatorio.';
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

    if (!validateForm()) {
        return;
    }

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    errorMessage.value = '';
    try {
        const apiUrl = new URL(`/api/users/login`, process.env.VUE_APP_API_URL);
        const response = await axios.post(apiUrl.toString(), {
            email: email.value,
            password: password.value,
        });

        if (response.status === 200) {
            const { token } = response.data;
            localStorage.setItem('token', token);
            router.push('/');
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
</script>

<template>
    <div class="flex flex-col min-h-full">
        <SignNav title="Iniciar sesión" description="¡Bienvenido de nuevo a Libelo!" />
        <div class="flex flex-col justify-between gap-2 p-2 flex-grow">
            <div class="flex flex-col gap-5">
                <BaseInput identifier="email" placeholder="Introduzca su correo electrónico..." label="Correo electrónico" type="email" v-model="email" :error="!!errors.email" :error-message="errors.email" @input="validateEmail" />
                <BaseInput identifier="password" placeholder="Introduzca su contraseña..." label="Contraseña" type="password" v-model="password" :error="!!errors.password" :error-message="errors.password" @input="validatePassword" />
                <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
                    <CircleAlert :size="16" />
                    <span class="text-sm">{{ errorMessage }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <BaseButton @click="handleLogin" primary>{{ loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}</BaseButton>
                    <div class="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 h-12 w-full">
                        <hr class="w-full border-neutral-300" />
                        <span class="text-neutral-700 text-sm text-center">o inicia sesión con</span>
                        <hr class="w-full border-neutral-300" />
                    </div>
                    <GoogleLogin />
                </div>
            </div>
            <div class="flex items-center justify-center h-12 w-full">
                <p class="text-neutral-700">¿No tienes una cuenta? <router-link to="/register" class="text-libelo-500 font-semibold ml-1">Regístrate ahora</router-link></p>
            </div>
        </div>
    </div>
</template>
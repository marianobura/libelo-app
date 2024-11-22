<script setup>
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import SignNav from '../components/SignAccount/SignNav.vue';
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { CircleAlert } from "lucide-vue-next";

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleRegister = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    errorMessage.value = '';
    try {
        const apiUrl = new URL(`/api/users/`, process.env.VUE_APP_API_URL);
        const response = await axios.post(apiUrl.toString(), {
            firstName: firstName.value,
            lastName: lastName.value,
            username: username.value,
            email: email.value,
            password: password.value,
        });

        if (response.status === 200) {
            router.push('/login');
        }
    } catch (error) {
        if (error.response) {
            errorMessage.value = error.response.data.msg;
        } else if (!firstName.value || !lastName.value || !username.value || !email.value || !password.value) {
            errorMessage.value = 'Por favor, complete todos los campos.';
        } else if (password.value < 8) {
            errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
        } else {
            errorMessage.value = 'Ocurrió un error inesperado.';
        }
    }

    loading.value = false;
};
</script>

<template>
    <div class="flex flex-col min-h-full">
        <SignNav title="Crear cuenta" description="Crea una cuenta nueva y estudia de manera eficiente." />
        <div class="flex flex-col justify-between gap-2 p-2 flex-grow">
            <div class="flex flex-col gap-5">
                <div class="grid grid-cols-2 gap-2">
                    <BaseInput identifier="first-name" placeholder="Introduzca su nombre..." label="Nombre" type="text" v-model="firstName" :error="errorMessage ? true : false" />
                    <BaseInput identifier="last-name" placeholder="Introduzca su apellido..." label="Apellido" type="text" v-model="lastName" :error="errorMessage ? true : false" />
                </div>
                <BaseInput identifier="username" placeholder="Introduzca su nombre de usuario..." label="Nombre de usuario" type="text" v-model="username" :error="errorMessage ? true : false" />
                <BaseInput identifier="email" placeholder="Introduzca su correo electrónico..." label="Correo electrónico" type="email" v-model="email" :error="errorMessage ? true : false" />
                <BaseInput identifier="password" placeholder="Introduzca su contraseña..." label="Contraseña" type="password" v-model="password" :error="errorMessage ? true : false" />
                <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
                    <CircleAlert :size="16" />
                    <span class="text-sm">{{ errorMessage }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <BaseButton @click="handleRegister" primary>{{ loading ? 'Creando cuenta...' : 'Crear cuenta' }}</BaseButton>
                    <div class="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 h-12 w-full">
                        <hr class="w-full border-neutral-300" />
                        <span class="text-neutral-700 text-sm text-center">o inicia sesión con</span>
                        <hr class="w-full border-neutral-300" />
                    </div>
                    <GoogleLogin />
                </div>
            </div>
            <div class="p-2">
                <div class="flex items-center justify-center h-12 w-full">
                    <p class="text-neutral-700">¿Ya tienes una cuenta? <router-link to="/login" class="text-libelo-500 font-semibold ml-1">Inicia sesión</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>
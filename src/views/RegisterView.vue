<script setup>
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import SignNav from '../components/SignAccount/SignNav.vue';
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

const handleRegister = async () => {
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
        } else {
            errorMessage.value = 'Ocurrió un error inesperado.';
        }
    }
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
                <BaseInput identifier="email" placeholder="Introduzca su correo electrónico..." label="Correo electrónico" type="text" v-model="email" :error="errorMessage ? true : false" />
                <BaseInput identifier="password" placeholder="Introduzca su contraseña..." label="Contraseña" type="password" v-model="password" :error="errorMessage ? true : false" />
                <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
                    <CircleAlert :size="16" />
                    <span class="text-sm">{{ errorMessage }}</span>
                </div>
                <div class="flex flex-col gap-2">
                    <BaseButton @click="handleRegister" primary content="Crear cuenta" />
                    <div class="grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 h-12 w-full">
                        <hr class="w-full border-neutral-300" />
                        <span class="text-neutral-700 text-sm text-center">o inicia sesión con</span>
                        <hr class="w-full border-neutral-300" />
                    </div>
                    <button class="flex items-center justify-center gap-2 h-12 w-full bg-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-300">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.06 12.25C23.06 11.47 22.99 10.72 22.86 10H12.5V14.255H18.42C18.165 15.63 17.39 16.795 16.225 17.575V20.335H19.78C21.86 18.42 23.06 15.6 23.06 12.25Z" fill="#4285F4"/>
                            <path d="M12.5 23C15.47 23 17.96 22.015 19.78 20.335L16.225 17.575C15.24 18.235 13.98 18.625 12.5 18.625C9.63501 18.625 7.21001 16.69 6.34501 14.09H2.67001V16.94C4.48001 20.535 8.20001 23 12.5 23Z" fill="#34A853"/>
                            <path d="M6.345 14.09C6.125 13.43 6 12.725 6 12C6 11.275 6.125 10.57 6.345 9.91V7.06H2.67C1.9 8.59286 1.49932 10.2846 1.5 12C1.5 13.775 1.925 15.455 2.67 16.94L6.345 14.09Z" fill="#FBBC05"/>
                            <path d="M12.5 5.375C14.115 5.375 15.565 5.93 16.705 7.02L19.86 3.865C17.955 2.09 15.465 1 12.5 1C8.20001 1 4.48001 3.465 2.67001 7.06L6.34501 9.91C7.21001 7.31 9.63501 5.375 12.5 5.375Z" fill="#EA4335"/>
                        </svg>
                        <span>Continuar con Google</span>
                    </button>
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
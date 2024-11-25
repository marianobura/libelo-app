<script setup>
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';
import SignNav from '../components/SignAccount/SignNav.vue';
import GoogleLogin from '@/components/SignAccount/GoogleLogin.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { CircleAlert } from "lucide-vue-next";
import BaseBody from '@/components/BaseBody.vue';

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const errors = ref({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
});

const handleRegister = async () => {
    const validateFirstName = () => {
        errors.value.firstName = firstName.value === '' ? 'El nombre es obligatorio.' : '';
    };

    const validateLastName = () => {
        errors.value.lastName = lastName.value === '' ? 'El apellido es obligatorio.' : '';
    };

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
        validateFirstName();
        validateLastName();
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
        const apiUrl = new URL(`/api/users/`, process.env.VUE_APP_API_URL);
        const response = await axios.post(apiUrl.toString(), {
            firstName: firstName.value,
            lastName: lastName.value,
            displayName: firstName.value + ' ' + lastName.value,
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
        <SignNav title="Crear cuenta" description="Crea una cuenta nueva y estudia de manera eficiente." />
        <BaseBody sign>
            <div class="flex flex-col gap-5">
                <div class="grid grid-cols-2 gap-2">
                    <BaseInput identifier="first-name" placeholder="Introduzca su nombre..." label="Nombre" type="text" v-model="firstName" :error="!!errors.firstName" :error-message="errors.firstName" @input="validateFirstName" />
                    <BaseInput identifier="last-name" placeholder="Introduzca su apellido..." label="Apellido" type="text" v-model="lastName" :error="!!errors.lastName" :error-message="errors.lastName" @input="validateLastName" />
                </div>
                <BaseInput identifier="email" placeholder="Introduzca su correo electrónico..." label="Correo electrónico" type="email" v-model="email" :error="!!errors.email" :error-message="errors.email" @input="validateEmail" />
                <BaseInput password identifier="password" placeholder="Introduzca su contraseña..." label="Contraseña" type="password" v-model="password" :error="!!errors.password" :error-message="errors.password" @input="validatePassword" />
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
        </BaseBody>
    </div>
</template>
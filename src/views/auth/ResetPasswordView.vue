<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseBody from '@/components/BaseBody.vue';
import SignNav from '@/components/SignAccount/SignNav.vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const tokenInput = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);
const errors = ref({ email: '', newPassword: '', confirmPassword: '', token: '' });
const token = ref('');
const step = ref(1);

onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    token.value = urlParams.get('token');
    if (token.value) {
        tokenInput.value = token.value;
    }
});

const validateEmail = () => {
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!email.value) {
        errors.value.email = 'El correo es obligatorio.';
    } else if (!emailPattern.test(email.value)) {
        errors.value.email = 'Correo inválido.';
    } else {
        errors.value.email = '';
    }
};

const validatePassword = () => {
    if (!newPassword.value || newPassword.value.length < 8) {
        errors.value.newPassword = 'La contraseña debe tener al menos 8 caracteres.';
    } else {
        errors.value.newPassword = '';
    }

    if (newPassword.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Las contraseñas no coinciden.';
    } else {
        errors.value.confirmPassword = '';
    }
};

const sendResetEmail = async () => {
    validateEmail();
    if (errors.value.email) return;

    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const mailUrl = new URL(`/api/auth/sendMail/${email.value}`, process.env.VUE_APP_API_URL);
        const response = await fetch(mailUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error('Error al enviar el correo');
        }

        successMessage.value = 'Correo enviado con instrucciones.';
        step.value = 2;

    } catch (error) {
        errorMessage.value = error.message || 'Error al enviar el correo.';
    } finally {
        loading.value = false;
    }
};

const verifyToken = async () => {
    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const tokenUrl = new URL('/api/auth/validateToken', process.env.VUE_APP_API_URL);
        const response = await axios.post(tokenUrl.toString(), {
            token: tokenInput.value
        });

        if (response.data?.valid) {
            successMessage.value = 'Token verificado correctamente.';
            step.value = 3;
        } else {
            errorMessage.value = response.data?.message || 'El token no es válido o ha expirado.';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error al verificar el token.';
    } finally {
        loading.value = false;
    }
};

const resetPasswordWithId = async () => {
    validatePassword();
    validateEmail();

    if (errors.value.email || errors.value.newPassword || errors.value.confirmPassword) return;

    loading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const getUserUrl = new URL(`/api/users`, process.env.VUE_APP_API_URL);
        getUserUrl.searchParams.set('email', email.value);
        const userResponse = await axios.get(getUserUrl.toString());

        const users = userResponse.data?.data || [];
        const userData = users.find(u => u.email === email.value);

        if (!userData || !userData._id) {
            throw new Error('No se encontró un usuario con ese correo.');
        }


        const apiUrl = new URL(`/api/users/${userData._id}`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl.toString(), {
            password: newPassword.value
        });

        userStore.user = response.data?.data || {};
        successMessage.value = 'Contraseña actualizada correctamente.';
        newPassword.value = '';
        confirmPassword.value = '';
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        errorMessage.value = error.message || 'No se pudo actualizar la contraseña. Inténtalo de nuevo.';
    } finally {
        router.push('/login');
        loading.value = false;
    }
};

</script>

<template>
    <div class="flex flex-col min-h-full">
        <SignNav title="Recuperar contraseña" />
        <BaseBody sign>
            <div class="flex flex-col gap-3">
                <BaseInput v-if="step === 1" identifier="email" placeholder="usuario@email.com" label="Correo electrónico" type="email" v-model="email" :error="!!errors.email" :error-message="errors.email" />
                <BaseButton @click="sendResetEmail" primary v-if="step === 1">{{ loading ? 'Enviando...' : 'Enviar correo de recuperación' }}</BaseButton>

                <BaseInput v-if="step === 2" identifier="token" placeholder="Ingrese el token" label="Token de recuperación" type="text" v-model="tokenInput" :error="!!errors.token" :error-message="errors.token" />
                <BaseButton @click="verifyToken" primary v-if="step === 2 && tokenInput">{{ loading ? 'Verificando...' : 'Verificar Token' }}</BaseButton>

                <BaseInput v-if="step === 3" identifier="new-password" placeholder="Nueva contraseña" label="Nueva contraseña" type="password" v-model="newPassword" :error="!!errors.newPassword" :error-message="errors.newPassword" />
                <BaseInput v-if="step === 3" identifier="confirm-password" placeholder="Confirma tu contraseña" label="Confirmar contraseña" type="password" v-model="confirmPassword" :error="!!errors.confirmPassword" :error-message="errors.confirmPassword" />
                <BaseButton @click="resetPasswordWithId" primary v-if="step === 3">{{ loading ? 'Procesando...' : 'Actualizar contraseña' }}</BaseButton>

                <div v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</div>
                <div v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</div>
            </div>
        </BaseBody>
    </div>
</template>
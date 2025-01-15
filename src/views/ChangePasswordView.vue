<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import { useUserStore } from '../stores/userStore';
import { onMounted } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import { ref } from 'vue';
import axios from 'axios';
import BaseButton from '@/components/BaseButton.vue';
import { CircleAlert } from 'lucide-vue-next';

const userStore = useUserStore();
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');

const errors = ref({
    password: '',
    confirmPassword: '',
});

const updateUser = async () => {
    const validatePassword = () => {
        if (password.value === '') {
            errors.value.password = 'La contraseña es obligatoria.';
        } else if (password.value.length < 8) {
            errors.value.password = 'La contraseña debe tener al menos 8 caracteres.';
        } else {
            errors.value.password = '';
        }
    };

    const validateConfirmPassword = () => {
        if (confirmPassword.value === '') {
            errors.value.confirmPassword = 'La confirmación de la contraseña es obligatoria.';
        } else if (confirmPassword.value !== password.value) {
            errors.value.confirmPassword = 'Las contraseñas no coinciden.';
        } else {
            errors.value.confirmPassword = '';
        }
    };

    const validateForm = () => {
        validatePassword();
        validateConfirmPassword();
        return !Object.values(errors.value).some((error) => error !== '');
    };

    if (!validateForm()) {
        return;
    }

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl.toString(), {
            password: password.value
        });
        userStore.user = response.data?.data || {};
        password.value = '';
        confirmPassword.value = '';
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        errorMessage.value = 'No se pudo actualizar la contraseña. Inténtalo de nuevo.';
    }

    loading.value = false;
};

onMounted(async () => {
    await userStore.fetchUser();
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Editar perfil" />
        <div class="flex flex-col gap-2 p-2">
            <div class="flex flex-col gap-4">
                <BaseInput password identifier="password" placeholder="Ingrese una nueva contraseña" label="Contraseña" type="password" v-model="password" :error="!!errors.password" :error-message="errors.password" @input="validatePassword" />
                <BaseInput password identifier="confirmPassword" placeholder="Confirme su nueva contraseña" label="Confirmar contraseña" type="password" v-model="confirmPassword" :error="!!errors.confirmPassword" :error-message="errors.confirmPassword" @input="validateConfirmPassword" />
                <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
                    <CircleAlert :size="16" />
                    <span class="text-sm">{{ errorMessage }}</span>
                </div>
                <BaseButton primary @click="updateUser">{{ loading ? 'Actualizando contraseña...' : 'Actualizar contraseña' }}</BaseButton>
            </div>
        </div>
    </BaseBody>
</template>
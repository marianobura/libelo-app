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

const validatePasswords = () => {
    errorMessage.value = '';
    if (password.value.length < 8) {
        errorMessage.value = 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Las contraseñas no coinciden.';
    }
};

const updateUser = async () => {
    validatePasswords();
    if (errorMessage.value.length > 0) return;

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
                <div class="flex flex-col gap-2">
                    <BaseInput identifier="password" placeholder="Ingrese una nueva contraseña" label="Contraseña" type="password" v-model="password" />
                    <span class="text-sm text-neutral-600">Tiene que tener al menos 8 caracteres.</span>
                </div>
                <div class="flex flex-col gap-2">
                    <BaseInput identifier="confirmPassword" placeholder="Confirme su nueva contraseña" label="Confirmar contraseña" type="password" v-model="confirmPassword" />
                    <span class="text-sm text-neutral-600">Ambas contraseñas tienen que coincidir.</span>
                </div>
                <div v-if="errorMessage" class="flex items-center gap-2 bg-red-100 border border-red-500 text-red-600 p-2 rounded-xl">
                    <CircleAlert :size="16" />
                    <span class="text-sm">{{ errorMessage }}</span>
                </div>
                <BaseButton primary @click="updateUser">{{ loading ? 'Actualizando contraseña...' : 'Actualizar contraseña' }}</BaseButton>
            </div>
        </div>
    </BaseBody>
</template>
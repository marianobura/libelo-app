<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import axios from 'axios';
import BaseButton from '@/components/BaseButton.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { watchEffect } from 'vue';

const userStore = useUserStore();
const firstName = ref('');
const lastName = ref('');
const loading = ref(false);

const errors = ref({
    firstName: '',
    lastName: '',
})

const validateFirstName = () => {
    if (firstName.value === '') {
        errors.value.firstName = 'El nombre es obligatorio.';
    } else {
        errors.value.firstName = '';
    }
};

const validateLastName = () => {
    if (lastName.value === '') {
        errors.value.lastName = 'El apellido es obligatorio.';
    } else {
        errors.value.lastName = '';
    }
};

const validateForm = () => {
    validateFirstName();
    validateLastName();
    return !Object.values(errors.value).some((error) => error !== '');
};

const updateUser = async () => {
    if (!validateForm()) {
        return;
    }

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl.toString(), { 
            firstName: firstName.value || userStore?.user.firstName,
            lastName: lastName.value || userStore?.user.lastName,
            displayName: firstName.value + ' ' + lastName.value || userStore?.user.displayName,
        });
        userStore.user = response.data?.data || {};
        firstName.value = userStore?.user.firstName;
        lastName.value = userStore?.user.lastName;
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
    }

    loading.value = false;
};

watchEffect(() => {
    firstName.value = userStore?.user.firstName;
    lastName.value = userStore?.user.lastName;
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Editar perfil" />
        <div class="flex flex-col gap-4 p-2">
            <div class="flex gap-4 items-center">
                <UserAvatar size="12" />
                <div class="flex flex-col">
                    <p class="font-semibold">{{ userStore?.user.displayName }}</p>
                    <router-link to="/settings/change-password" class="text-sm text-libelo-500">Cambiar contraseña</router-link>
                </div>
            </div>
            <hr class="border-neutral-300">
            <div class="flex flex-col gap-2">
                <BaseInput identifier="firstName" label="Nombre" type="text" v-model="firstName" :error="!!errors.firstName" :error-message="errors.firstName" />
                <BaseInput identifier="lastName" label="Apellido" type="text" v-model="lastName" :error="!!errors.lastName" :error-message="errors.lastName" />
                <BaseButton primary @click="updateUser">{{ loading ? 'Actualizando perfil...' : 'Actualizar perfil' }}</BaseButton>
            </div>
        </div>
    </BaseBody>
</template>
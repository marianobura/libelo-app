<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import { useUserStore } from '../stores/userStore';
import { onMounted } from 'vue';
import BaseInput from '@/components/BaseInput.vue';
import { ref } from 'vue';
import axios from 'axios';
import BaseButton from '@/components/BaseButton.vue';

const userStore = useUserStore();
const firstName = ref('');
const lastName = ref('');
const username = ref('');
const loading = ref(false);

const updateUser = async () => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl.toString(), { 
            firstName: firstName.value || userStore?.user.firstName,
            lastName: lastName.value || userStore?.user.lastName,
            username: username.value || userStore?.user.username
        });
        userStore.user = response.data?.data || {};
        firstName.value = '';
        lastName.value = '';
        username.value = '';
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
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
        <div class="flex flex-col gap-4 p-2">
            <div class="flex gap-4 items-center">
                <img src="https://avatar.iran.liara.run/public/2" alt="Imagen de perfil" class="size-12">
                <div class="flex flex-col">
                    <p class="font-semibold">{{ userStore?.user.firstName }} {{ userStore?.user.lastName }}</p>
                    <p class="text-sm text-neutral-700">@{{ userStore?.user.username }}</p>
                </div>
            </div>
            <hr class="border-neutral-300">
            <div class="flex flex-col gap-2">
                <div class="grid grid-cols-2 gap-2">
                    <BaseInput identifier="firstName" :placeholder="userStore?.user.firstName" label="Nombre" type="text" v-model="firstName" />
                    <BaseInput identifier="lastName" :placeholder="userStore?.user.lastName" label="Apellido" type="text" v-model="lastName" />
                </div>
                <BaseInput identifier="username" :placeholder="userStore?.user.username" label="Nombre de usuario" type="text" v-model="username" />
                <BaseButton primary @click="updateUser">{{ loading ? 'Actualizando perfil...' : 'Actualizar perfil' }}</BaseButton>
            </div>
        </div>
    </BaseBody>
</template>
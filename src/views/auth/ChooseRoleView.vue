<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import BaseButton from '@/components/BaseButton.vue';
import { Check } from 'lucide-vue-next';

const info = [
    {
        title: 'Estudiante',
        description: 'Consulta tus materias y aprende de manera interactiva.',
        role: 'student',
    },
    {
        title: 'Profesor',
        description: 'Accede a herramientas para ayudar a los estudiantes.',
        role: 'teacher',
    },
];
const userStore = useUserStore();
const router = useRouter();
const selectedRole = ref(null);

const handleRole = async (selectedRoleValue) => {
    selectedRole.value = selectedRoleValue;
};

const confirmRole = async () => {
    if (!selectedRole.value) return;

    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl.toString(), { 
            role: selectedRole.value,
        });

        if (response.status === 200) {
            localStorage.setItem('role', selectedRole.value);
            if (selectedRole.value === 'student') {
                router.push('/student');
            } else if (selectedRole.value === 'teacher') {
                router.push('/teacher');
            }
        }
    } catch (error) {
        console.error('Error al seleccionar el rol:', error);
    }
};

onMounted(async () => {
    await userStore.fetchUser();
});
</script>

<template>
    <div class="flex items-center justify-center w-full h-screen p-2">
        <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-2 items-center text-wrap">
                <h1 class="text-2xl font-semibold text-center">Elige tu perfil para comenzar</h1>
                <p class="text-neutral-700 text-pretty text-center max-w-64">Selecciona tu tipo de cuenta para empezar a explorar la aplicación.</p>
            </div>
            <div class="flex flex-col gap-4 w-full">
                <div v-for="i in info" :key="i.role" @click="handleRole(i.role)" class="flex justify-between items-center gap-12 outline outline-1 outline-neutral-300 p-2 rounded-xl has-[input:checked]:outline-libelo-500 has-[input:checked]:outline-2 overflow-hidden">
                    <div class="flex gap-4 items-center">
                        <div class="size-16 flex-shrink-0 content-end rounded-lg overflow-hidden">
                            <img :src="(`/img/${i.role}.svg`)" :alt="`Ilustración de un ${i.title.toLowerCase()}`" />
                        </div>
                        <div class="flex flex-col">
                            <h2 class="font-semibold">{{ i.title }}</h2>
                            <p class="text-sm text-neutral-700">{{ i.description }}</p>
                        </div>
                    </div>
                    <div class="relative">
                        <input type="checkbox" :checked="selectedRole === i.role" class="appearance-none peer hidden" disabled />
                        <span class="w-5 h-5 flex items-center justify-center border-2 border-neutral-300 text-white peer-checked:bg-libelo-500 peer-checked:border-transparent rounded-md">
                            <Check v-if="selectedRole === i.role" />
                        </span>
                    </div>
                </div>
            </div>
            <BaseButton primary @click="confirmRole">Confirmar y continuar</BaseButton>
        </div>
    </div>
</template>
<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseNav from '@/components/BaseNav.vue';
import BaseTitle from '@/components/BaseTitle.vue';
import { ref, computed } from 'vue';
import subjectsData from '@/assets/subjects.json';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';

const userStore = useUserStore();
const favoriteSubjects = ref([...userStore?.user?.preferredSubjects || []]);
const searchQuery = ref("");
const loading = ref(false);

const teacherSubjects = computed(() => {
    return userStore.user?.preferredSubjects || [];
});

const filteredSubjects = computed(() => {
    return Object.keys(subjectsData.subjects).filter(subject =>
        subject.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const toggleSubject = (subject) => {
    if (favoriteSubjects.value.includes(subject)) {
        favoriteSubjects.value = favoriteSubjects.value.filter(fav => fav !== subject);
    } else {
        favoriteSubjects.value.push(subject);
    }
};

const saveSubjects = async () => {
    if (loading.value) return;

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}`, process.env.VUE_APP_API_URL);
        await axios.put(apiUrl.toString(), {
            preferredSubjects: favoriteSubjects.value
        });

        userStore.user.preferredSubjects = [...favoriteSubjects.value];
    } catch (error) {
        console.error("Error al actualizar materias favoritas:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Materias favoritas" />
        <div class="flex flex-col gap-4 p-4">
            <div class="w-full flex flex-col gap-2 h-fit p-3 text-white bg-red-800 rounded-xl">
                <p class="text-lg font-medium uppercase">Materias favoritas</p>
                <div class="flex gap-2 flex-wrap">
                    <span v-if="teacherSubjects.length === 0" class="text-sm">No has seleccionado ninguna materia.</span>
                    <p v-else v-for="subject in teacherSubjects" class="text-sm px-2 rounded-xl border border-neutral-200">{{ subject }}</p>
                </div>
            </div>
            <BaseTitle title="Materias favoritas" description="Selecciona tus materias favoritas y guárdalas en tu perfil.">
                <BaseInput v-model="searchQuery" identifier="search" placeholder="Buscar materia..." />
                <div class="flex flex-col gap-4 p-2 border border-neutral-300 rounded-xl">
                    <div v-for="subject in filteredSubjects" :key="subject" class="flex items-center gap-2">
                        <input type="checkbox" :id="subject" :checked="favoriteSubjects.includes(subject)" @change="toggleSubject(subject)" class="size-5" />
                        <label :for="subject" class="line-clamp-1 break-all w-full">{{ subject }}</label>
                    </div>
                </div>
                <BaseButton primary @click="saveSubjects">{{ loading ? "Guardando..." : "Guardar materias" }}</BaseButton>
            </BaseTitle>
        </div>
    </BaseBody>
</template>
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
import { goTo } from '@/router';
import { Check } from 'lucide-vue-next';

const userStore = useUserStore();
const favoriteSubjects = ref([...userStore?.user?.preferredSubjects || []]);
const searchQuery = ref("");
const loading = ref(false);

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
        goTo('/teacher');
        loading.value = false;
    }
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Materias favoritas" />
        <div class="flex flex-col gap-4 p-4">
            <div class="w-full flex justify-center p-2 text-libelo-500 border-2 border-libelo-500 rounded-full text-sm font-semibold">
                <p>Ver lista de materias</p>
            </div>
            <BaseTitle title="Materias favoritas" description="Selecciona tus materias favoritas y guárdalas en tu perfil.">
                <BaseInput v-model="searchQuery" identifier="search" placeholder="Buscar materia..." />
                <div class="flex flex-col gap-2">
                    <div v-for="subject in filteredSubjects" :key="subject" class="flex justify-between items-center gap-2 border border-neutral-300 px-4 py-2 rounded-xl has-[input:checked]:border-libelo-500">
                        <label :for="subject" class="line-clamp-1 break-all w-full">{{ subject }}</label>
                        <div class="relative">
                            <input type="checkbox" :id="subject" :checked="favoriteSubjects.includes(subject)" @change="toggleSubject(subject)" class="appearance-none peer hidden" />
                            <span class="w-5 h-5 flex items-center justify-center border-2 border-neutral-300 text-white peer-checked:bg-libelo-500 peer-checked:border-transparent rounded-md">
                                <Check v-if="favoriteSubjects.includes(subject)" />
                            </span>
                        </div>
                    </div>
                </div>
                <BaseButton primary @click="saveSubjects">{{ loading ? "Guardando..." : "Guardar materias" }}</BaseButton>
            </BaseTitle>
        </div>
    </BaseBody>
</template>
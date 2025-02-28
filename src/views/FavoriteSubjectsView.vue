<script setup>
import BaseBody from '@/components/BaseBody.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseNav from '@/components/BaseNav.vue';
import { ref, computed } from 'vue';
import subjectsData from '@/assets/subjects.json';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';
import BaseInput from '@/components/BaseInput.vue';
import { Check, ChevronDown } from 'lucide-vue-next';
import { goTo } from '@/router';

const userStore = useUserStore();
const favoriteSubjects = ref(userStore.user.preferredSubjects || {});
const expandedSubjects = ref([]);
const searchQuery = ref("");
const loading = ref(false);

const filteredSubjects = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    return Object.keys(subjectsData.subjects).map(subject => {
        const normalizedSubject = subject.toLowerCase();

        if (normalizedSubject.includes(query)) {
            return {
                subject,
                branches: subjectsData.subjects[subject]
            };
        }

        const branches = subjectsData.subjects[subject].filter(branch =>
            branch.toLowerCase().includes(query)
        );

        if (branches.length > 0) {
            return {
                subject,
                branches
            };
        }

        return null;
    }).filter(item => item !== null);
});

const toggleExpand = (subject) => {
    if (expandedSubjects.value.includes(subject)) {
        expandedSubjects.value = expandedSubjects.value.filter(s => s !== subject);
    } else {
        expandedSubjects.value.push(subject);
    }
};

const toggleSubject = (subject) => {
    const branches = subjectsData.subjects[subject];
    const currentBranches = favoriteSubjects.value[subject] || [];

    favoriteSubjects.value[subject] = (currentBranches.length === branches.length) ? [] : [...branches];
};

const toggleBranch = (subject, branch) => {
    const currentBranches = favoriteSubjects.value[subject] || [];

    if (!favoriteSubjects.value[subject]) {
        favoriteSubjects.value[subject] = [];
    }

    if (currentBranches.includes(branch)) {
        favoriteSubjects.value[subject] = currentBranches.filter(b => b !== branch);
    } else {
        favoriteSubjects.value[subject].push(branch);
    }
};

const saveSubjects = async () => {
    if (loading.value) return;

    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const groupedSubjects = Object.keys(favoriteSubjects.value).reduce((acc, subject) => {
        const selectedBranches = favoriteSubjects.value[subject] || [];

        if (selectedBranches.length > 0) {
            acc.push([subject, selectedBranches]);
        }

        return acc;
    }, []);

    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}/preferredSubjects`, process.env.VUE_APP_API_URL);
        await axios.put(apiUrl.toString(), {
            preferredSubjects: groupedSubjects
        });
    } catch (error) {
        console.error("Error al guardar las materias favoritas:", error);
    } finally {
        loading.value = false;
        goTo("/teacher");
    }
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Materias favoritas" />
        <div class="grid grid-rows-[auto_1fr_auto] gap-2 p-2 max-h-[calc(100vh-60px)]">
            <BaseInput search v-model="searchQuery" identifier="search" placeholder="Buscar materia" />
            <div v-if="filteredSubjects.length > 0" class="flex flex-col gap-2 overflow-y-auto">
                <div v-for="item in filteredSubjects" :key="item.subject" class="rounded-xl bg-white">
                    <div @click="toggleExpand(item.subject)" class="flex justify-between items-center p-2 cursor-pointer">
                        <div class="flex items-center gap-2">
                            <input type="checkbox" :id="'checkbox-' + item.subject" :checked="favoriteSubjects[item.subject]?.length === item.branches.length" @change="toggleSubject(item.subject)" class="appearance-none peer hidden" />
                            <span @click.stop="toggleSubject(item.subject)" class="w-5 h-5 flex items-center justify-center border border-neutral-300 text-white peer-checked:bg-libelo-500 peer-checked:border-transparent rounded-full cursor-pointer">
                                <Check v-if="favoriteSubjects[item.subject]?.length === item.branches.length" class="w-4 h-4 text-white" />
                            </span>
                            <span class="font-semibold">{{ item.subject }}</span>
                        </div>
                        <ChevronDown class="transition-transform duration-300 ease-in-out" :class="{ 'rotate-180': expandedSubjects.includes(item.subject) }" />
                    </div>
                    <div class="overflow-hidden transition-[height] duration-300 ease-in-out" :style="{ height: expandedSubjects.includes(item.subject) ? 'auto' : '0' }">
                        <div v-for="branch in item.branches" :key="branch" class="flex w-full">
                            <div @click.stop="toggleBranch(item.subject, branch)" class="flex items-center gap-2 pl-8 py-2 w-full">
                                <input type="checkbox" :id="'checkbox-' + branch" :checked="favoriteSubjects[item.subject]?.includes(branch)" @change="toggleBranch(item.subject, branch)" class="appearance-none peer hidden" />
                                <span @click.stop="toggleBranch(item.subject, branch)" class="w-5 h-5 flex items-center justify-center border border-neutral-300 text-white peer-checked:bg-libelo-500 peer-checked:border-transparent rounded-full cursor-pointer flex-shrink-0">
                                    <Check v-if="favoriteSubjects[item.subject]?.includes(branch)" class="w-4 h-4 text-white" />
                                </span>
                                <span class="text-sm">{{ branch }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-red-500 font-semibold text-center mt-4">
                No se encontraron resultados para tu búsqueda.
            </div>
            <BaseButton primary @click="saveSubjects">{{ loading ? "Guardando..." : "Guardar materias" }}</BaseButton>
        </div>
    </BaseBody>
</template>

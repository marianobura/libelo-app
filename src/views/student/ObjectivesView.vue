<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { ref, computed, watchEffect } from "vue";
import { useSubjectStore } from "@/stores/subjectStore";
import ObjectivesModal from "@/components/Objectives/ObjectivesModal.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Check, LoaderCircle, X, Trash2 } from "lucide-vue-next";
import BaseModal from "@/components/BaseModal.vue";

const subjectStore = useSubjectStore();
const route = useRoute();
const loading = ref(true);
const showModal = ref(false);
const checkpointModal = ref(false);
const selectedCheckpointIndex = ref(null);
const showDeleteModal = ref(false);

const subjectId = computed(() => route.params.id);
const userObjectives = computed(() => subjectStore.subject?.objectives ?? []);
const maxProgress = 100;

const checkpoints = computed(() => {
    return userObjectives.value.length > 0
        ? userObjectives.value.map((_, index) => (index + 1) * (maxProgress / userObjectives.value.length))
        : [];
});

const progress = computed(() => {
    const completedCount = userObjectives.value.filter(opt => opt.completed).length;
    return checkpoints.value[completedCount - 1] || 0;
});

const addObjectiveToList = (newObjective) => {
    if (!newObjective || !newObjective._id) {
        console.error("El nuevo objetivo no tiene un ID válido:", newObjective);
        return;
    }

    if (!newObjective.text || newObjective.text.trim().length === 0) {
        console.error("El nuevo objetivo tiene un texto inválido:", newObjective.text);
        return;
    }

    if (!Object.prototype.hasOwnProperty.call(newObjective, "completed")) {
        newObjective.completed = false;
    }

    userObjectives.value.push(newObjective);
};

const removeObjective = async (objectiveId) => {
    if (!objectiveId) {
        console.error("Intentando eliminar un objetivo sin ID.");
        return;
    }

    if (!subjectStore.subject) return;

    try {
        const apiUrl = new URL(`/api/subjects/${subjectStore.subject._id}/objective/${objectiveId}`, process.env.VUE_APP_API_URL);
        await axios.delete(apiUrl.toString());
        subjectStore.subject.objectives = subjectStore.subject.objectives.filter(obj => obj._id !== objectiveId);
    } catch (error) {
        console.error("Error al eliminar el objetivo:", error.response?.data?.msg || error.message);
    }
};

const toggleCompletion = async (objective) => {
    if (!objective || !objective._id) {
        console.error("Error: El objetivo es undefined o no tiene _id", objective);
        return;
    }

    objective.completed = !objective.completed;

    try {
        const apiUrl = new URL(`/api/subjects/${subjectId.value}/objective/${objective._id}`, process.env.VUE_APP_API_URL);
        await axios.put(apiUrl.toString(), { completed: objective.completed });
    } catch (error) {
        console.error("Error al actualizar el estado del objetivo:", error.response?.data?.msg || error.message);
    }
};

watchEffect(() => {
    subjectStore.fetchSubject(subjectId.value);
    loading.value = false;
});

const openCheckpointModal = (index) => {
    selectedCheckpointIndex.value = index;
    checkpointModal.value = true;
};

const confirmDeleteObjectives = async () => {
    if (!subjectStore.subject || userObjectives.value.length === 0) {
        return;
    }

    try {
        const apiUrl = new URL(`/api/subjects/${subjectStore.subject._id}/clear-objectives`, process.env.VUE_APP_API_URL);
        await axios.delete(apiUrl.toString());
        subjectStore.subject.objectives = [];
    } catch (error) {
        console.error("Error al borrar todos los objetivos:", error.response?.data?.msg || error.message);
    } finally {
        showDeleteModal.value = false;
    }
};

const cutObjectives = (text, maxLength = 16) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength - 3) + '...';
    }
    return text;
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Objetivos" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <div v-if="loading" class="mt-12 flex items-center justify-center text-libelo-500 h-96">
                <div class="animate-spin">
                    <LoaderCircle :size="32" />
                </div>
                <div class="ml-2">
                    <p class="font-semibold">Cargando...</p>
                </div>
            </div>
            <div v-else-if="userObjectives.length === 0" class="flex flex-col items-center justify-center gap-2 w-full bg-neutral-200 border border-neutral-300 font-semibold p-2 rounded-xl">
                <span>Todavía no tienes ningún objetivo.</span>
                <BaseButton @click="showModal = true" primary>Agrega tu primer objetivo</BaseButton>
            </div>
            <div v-else class="flex flex-col justify-center w-full">
                <p class="text-center mb-2 font-semibold">Progreso actual: {{ progress.toFixed() }}%</p>
                <div class="relative w-full h-8 rounded-lg border-2 border-libelo-500 bg-white overflow-hidden">
                    <div class="h-full bg-libelo-500 transition-all duration-300" :style="{ width: `${progress}%` }"></div>
                    <div class="absolute top-1/2 left-0 w-full h-8 flex transform -translate-y-1/2">
                        <div v-for="(point, index) in checkpoints" :key="index" class="flex items-center justify-center h-full" :style="{ width: `${maxProgress / userObjectives.length}%` }">
                            <span class="w-2 h-2 rounded-full transition-all duration-300" :class="progress >= point ? 'bg-white border-white' : 'bg-libelo-500 border-libelo-500'" @click="openCheckpointModal(index)"></span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-2 mt-4">
                    <div v-for="objective in userObjectives" :key="objective._id" class="flex justify-between items-center gap-8 border border-neutral-300 p-2 rounded-xl has-[input:checked]:border-libelo-500">
                        <label :for="objective._id" class="flex items-center gap-2 line-clamp-1 break-all w-full">
                            <div class="relative mb-auto">
                                <input type="checkbox" :id="objective._id" :checked="objective.completed" @change="toggleCompletion(objective)" class="appearance-none peer hidden" />
                                <span class="size-6 flex items-center justify-center border-2 border-neutral-300 text-white peer-checked:bg-libelo-500 peer-checked:border-transparent rounded-md">
                                    <Check v-if="objective.completed" />
                                </span>
                            </div>
                            <span>{{ objective.text }}</span>
                        </label>
                        <div class="flex items-center justify-center mb-auto size-6 flex-shrink-0 border border-red-700 rounded-lg text-red-700 hover:bg-red-700 hover:text-white" @click="removeObjective(objective._id)">
                            <X :size="12"/>
                        </div>
                    </div>
                </div>

                <div class=" mt-4 grid grid-cols-[1fr_48px] gap-2">
                    <BaseButton @click="showModal = true" primary>Agregar objetivo</BaseButton>
                    <BaseButton danger @click="showDeleteModal = true" class="flex items-center justify-center"><Trash2 size="20" /></BaseButton>
                </div>
            </div>

            <ObjectivesModal :show-modal="showModal" @close="showModal = false" :subject-id="subjectId" @objective-added="addObjectiveToList" />

            <BaseModal v-if="checkpointModal" class="items-center justify-center">
                <div class="bg-white p-4 rounded-xl w-full mx-2">
                    <h2 class="text-lg font-semibold">Objetivo {{ selectedCheckpointIndex + 1 }}: {{ cutObjectives(userObjectives[selectedCheckpointIndex]?.text) }}</h2>
                    <div class="flex items-center gap-2 mt-3 mb-3">
                        <span v-if="userObjectives[selectedCheckpointIndex]?.completed" class="text-libelo-500 font-bold flex items-center">
                            <Check class="mr-1" /> Completado
                        </span>
                        <span v-else class="text-red-500 font-bold flex items-center">
                            <X class="mr-1" /> No completado
                        </span>
                    </div>
                    <div class="flex justify-end mt-3">
                        <BaseButton @click="checkpointModal = false" secondary>Cerrar</BaseButton>
                    </div>
                </div>
            </BaseModal>

            <BaseModal v-if="showDeleteModal" class="items-center justify-center">
                <div class="bg-white p-4 rounded-xl mx-2">
                    <div class="flex flex-col gap-1 w-full p-2">
                    <p class="font-semibold">Eliminar objetivos</p>
                    <p class="text-sm text-neutral-700">¿Está seguro de eliminar todos los objetivos actuales?</p>
                    </div>
                    <div class="flex justify-end mt-3 gap-4">
                        <BaseButton @click="showDeleteModal = false" secondary>Cancelar</BaseButton>
                        <BaseButton @click="confirmDeleteObjectives" danger>Eliminar</BaseButton>
                    </div>
                </div>
            </BaseModal>
        </div>
    </BaseBody>
</template>
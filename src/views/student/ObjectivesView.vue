<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import SubjectBanner from "@/components/Subject/SubjectBanner.vue";
import { ref, computed, watchEffect } from "vue";
import { useSubjectStore } from "@/stores/subjectStore";
import ObjectivesModal from "@/components/Objectives/ObjectivesModal.vue";
import CheckpointModal from "@/components/Objectives/CheckpointModal.vue";
import DeleteModal from "@/components/Objectives/DeleteModal.vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { Check, LoaderCircle, X, Trash2 } from "lucide-vue-next";
import BaseTitle from "@/components/BaseTitle.vue";
import Draggable from "vuedraggable";

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
console.log(userObjectives.value);

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

const saveObjectivesOrder = async () => {
    const subject = subjectStore.subject;

    if (!subject || !Array.isArray(subject.objectives) || subject.objectives.length === 0) {
        return;
    }

    try {
        const apiUrl = new URL(`/api/subjects/${subject._id}/objectives-order`, process.env.VUE_APP_API_URL);
        await axios.put(apiUrl.toString(), {
            objectives: subject.objectives,
        });
    } catch (error) {
        console.error("Error al guardar el orden de los objetivos:", error.response?.data?.msg || error.message);
    }
};

</script>

<template>
    <BaseBody>
        <BaseNav title="Objetivos" />
        <div class="flex flex-col gap-4 p-2">
            <SubjectBanner />
            <BaseTitle title="Gestiona tus objetivos" description="Agrega, edita o elimina tus objetivos para adaptarlos a tus necesidades y llevar un mejor seguimiento.">
                <div v-if="loading" class="mt-12 flex items-center justify-center text-libelo-500">
                    <LoaderCircle class="animate-spin" :size="32" />
                </div>
                <BaseButton v-else-if="userObjectives.length === 0" @click="showModal = true" primary>Agrega tu primer objetivo</BaseButton>
                <div v-else class="flex flex-col justify-center w-full">
                    <p class="text-center mb-2 font-semibold">Progreso actual: {{ progress.toFixed() }}%</p>
                    <div class="relative w-full h-8 rounded-lg border-2 border-libelo-500 bg-white overflow-hidden">
                        <div class="h-full bg-libelo-500 transition-all duration-300" :style="{ width: `${progress}%` }"></div>
                        <div class="absolute top-1/2 left-0 w-full h-8 flex transform -translate-y-1/2">
                            <div v-for="(point, index) in checkpoints" :key="index" class="flex items-center justify-center h-full" :style="{ width: `${maxProgress / userObjectives.length}%` }">
                                <span class="w-2 h-2 rounded-full transition-all duration-300" :class="progress >= point ? 'bg-white border-white' : 'bg-libelo-500 border-libelo-500'" @click="openCheckpointModal(index)"  data-popover-target="popover-default"></span>

                                <div data-popover id="popover-default" role="tooltip" class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
                                    <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                    </div>
                                    <div class="px-3 py-2">
                                        <p>Clickea el punto para ver el estado del Objetivo</p>
                                    </div>
                                    <div data-popper-arrow></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 mt-4">
                        <Draggable v-model="subjectStore.subject.objectives" item-key="_id" handle=".drag-handle" class="flex flex-col gap-2" @end="saveObjectivesOrder">
                            <template #item="{ element: objective }">
                                <div class="flex justify-between items-center gap-8 border border-neutral-300 p-2 rounded-xl has-[input:checked]:border-libelo-500">
                                    <label :for="objective._id" class="flex items-center gap-2 line-clamp-1 break-all w-full">
                                        <div class="drag-handle cursor-move size-6 flex items-center justify-center text-gray-400 hover:text-black">⋮</div>
                                        <div class="relative mb-auto">
                                            <input type="checkbox" :id="objective._id" :checked="objective.completed" @change="toggleCompletion(objective)" class="appearance-none peer hidden" />
                                            <span class="size-6 flex items-center justify-center border-2 border-neutral-300 text-white peer-checked:bg-libelo-500 peer-checked:border-transparent rounded-md">
                                                <Check v-if="objective.completed" />
                                            </span>
                                        </div>
                                        <span>{{ objective.text }}</span>
                                    </label>
                                    <div class="flex items-center justify-center mb-auto size-6 flex-shrink-0 border border-red-700 rounded-lg text-red-700 hover:bg-red-700 hover:text-white" @click="removeObjective(objective._id)">
                                        <X :size="12" />
                                    </div>
                                </div>
                            </template>
                        </Draggable>
                    </div>
                    <div class="mt-4 grid grid-cols-[1fr_48px] gap-2">
                        <BaseButton @click="showModal = true" primary>Agregar un objetivo</BaseButton>
                        <BaseButton danger @click="showDeleteModal = true" class="flex items-center justify-center"><Trash2 size="20" /></BaseButton>
                    </div>
                </div>
            </BaseTitle>
            <ObjectivesModal :show-modal="showModal" @close="showModal = false" :subject-id="subjectId" @objective-added="addObjectiveToList" />
            <CheckpointModal :show-modal="checkpointModal" :index="selectedCheckpointIndex" :objective="userObjectives[selectedCheckpointIndex]" @close="checkpointModal = false" />
            <DeleteModal :show-modal="showDeleteModal" @close="showDeleteModal = false" @confirm="confirmDeleteObjectives" />
        </div>
    </BaseBody>
</template>
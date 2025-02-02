<script setup>
import BaseButton from "@/components/BaseButton.vue";
import { X } from "lucide-vue-next";
import { defineProps, defineEmits, ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseInput from "@/components/BaseInput.vue";
import subjectsData from "@/assets/subjects.json";
import { computed } from "vue";

const subjects = ref(subjectsData.subjects);

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close", "add-subject"]);

const searchQuery = ref("");
const filteredSubjects = computed(() => {
    const query = searchQuery.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const results = {};

    for (const category in subjects.value) {
        const normalizedCategory = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (normalizedCategory.includes(query)) {
            results[category] = subjects.value[category];
        } else {
            const matches = subjects.value[category].filter((subject) => {
                const normalizedSubject = subject.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return normalizedSubject.includes(query);
            });

            if (matches.length > 0) {
                results[category] = matches;
            }
        }
    }

    return results;
});

const subjectSelected = ref("");

const closeModal = () => {
    emit("close");
};

const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const handleAddSubject = () => {
    if (subjectSelected.value.trim()) {
        emit("add-subject", subjectSelected.value.trim());
        subjectSelected.value = "";
        closeModal();
    }
};
</script>

<template>
    <BaseModal v-if="props.showModal" class="items-end justify-center" @click="handleOverlayClick">
        <div class="grid grid-rows-[auto_auto_1fr_auto] bg-white p-4 rounded-t-xl w-full h-[80%]">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">Nueva materia</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="py-2">
                <BaseInput v-model="searchQuery" identifier="search" placeholder="Busca una materia" />
            </div>
            <div class="pb-4 overflow-scroll">
                <ul class="flex flex-col gap-4">
                    <li v-for="(subjects, category) in filteredSubjects" :key="category">
                        <p class="font-semibold text-neutral-700">{{ category }}</p>
                        <ul class="pl-2">
                            <li v-for="subject in subjects" :key="subject" class="p-2 cursor-pointer rounded-md hover:bg-libelo-500 hover:text-white" @click="subjectSelected = subject">{{ subject }}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="pt-4 border-t border-t-neutral-200">
                <BaseButton @click="handleAddSubject" primary>Agregar materia</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
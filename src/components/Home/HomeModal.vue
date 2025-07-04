<script setup>
import BaseButton from "@/components/BaseButton.vue";
import { X } from "lucide-vue-next";
import { defineProps, defineEmits, ref, computed } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseInput from "@/components/BaseInput.vue";
import subjectsData from "@/assets/subjects.json";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

const userStore = useUserStore();
const subjects = ref(subjectsData.subjects);
const loading = ref(false);

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close", "refresh"]);

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

const addSubject = async () => {
    loading.value = true;

    try {
        const newSubject = {
            name: subjectSelected.value,
            studentId: userStore.user._id,
            teacherId: null,
        };

        const apiUrl = new URL(`/api/subjects`, process.env.VUE_APP_API_URL);
        const response = await axios.post(apiUrl.toString(), newSubject);
        
        emit("refresh", response.data.data);
    } catch (error) {
        console.error("Error al agregar la materia:", error);
    } finally {
        loading.value = false;
        closeModal();
    }
};
</script>

<template>
    <BaseModal :show="props.showModal" animation="slide-up" class="items-end justify-center" @close="closeModal">
        <div class="grid grid-rows-[auto_auto_1fr_auto] bg-white p-4 rounded-t-xl w-full h-[80%]">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">Nueva materia</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="py-2">
                <BaseInput search v-model="searchQuery" identifier="search" placeholder="Busca una materia" />
            </div>
            <div v-if="Object.keys(filteredSubjects).length > 0" class="overflow-scroll">
                <ul class="flex flex-col gap-4">
                    <li v-for="(subjects, category) in filteredSubjects" :key="category">
                        <p class="font-semibold text-neutral-700">{{ category }}</p>
                        <ul class="pl-2">
                            <li v-for="subject in subjects" :key="subject" class="p-2 cursor-pointer rounded-md hover:bg-libelo-500 hover:text-white" @click="subjectSelected = subject">{{ subject }}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div v-else class="text-red-500 font-semibold text-center mt-4">
                No se encontraron resultados para tu búsqueda.
            </div>
            <div class="pt-4 border-t border-t-neutral-200">
                <BaseButton @click="addSubject" primary>{{ loading ? 'Agregando materia...' : 'Agregar materia' }}</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
<script setup>
/* eslint-disable */
import { defineProps, defineEmits, ref, onMounted } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { useUserStore } from "@/stores/userStore";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import { X } from "lucide-vue-next";

const route = useRoute();
const path = route.params.id;
const loading = ref(false);
const courses = ref([])
const userStore = useUserStore();
const courseSelected = ref(null);

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close"]);

const closeModal = () => {
    emit("close");
};

const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const selectCourse = (course) => {
    courseSelected.value = { id: course.id, name: course.name };
};

const addCourse = async () => {
    if (!courseSelected.value) return;
    loading.value = true;
    try {
        const apiUrl = new URL(`/api/subjects/${path}`, process.env.VUE_APP_API_URL);
        await axios.put(apiUrl.toString(), {
            classroomId: courseSelected.value.id,
            classroomName: courseSelected.value.name
        });
    } catch (error) {
        console.error("Error al vincular la materia:", error);
    } finally {
        closeModal();
        loading.value = false;
    }
};

onMounted(async () => {
    await userStore.fetchUser();
    try {
        const res = await fetch('https://classroom.googleapis.com/v1/courses', {
            headers: {
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            }
        })
        const data = await res.json()
        courses.value = data.courses = data.courses.filter(course => course.courseState === 'ACTIVE') || []
    } catch (error) {
        console.error('Error al obtener cursos:', error)
    }
});
</script>

<template>
    <BaseModal v-if="props.showModal" class="items-end justify-center" @click="handleOverlayClick">
        <div class="grid grid-rows-[auto_1fr_auto] bg-white p-4 rounded-t-xl w-full h-auto max-h-[80%]">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">Vincular materia</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div v-if="userStore.user.google.isGoogleLinked" class="bg-white py-4 overflow-scroll">
                <ul v-if="courses.length" class="flex flex-col gap-2">
                    <li v-for="course in courses" :key="course.id" @click="selectCourse(course)" class="bg-neutral-100 p-2 rounded-lg transition-all hover:bg-libelo-500 hover:text-white">{{ course.name }}</li>
                </ul>
            </div>
            <div v-else>cuenta no asociada con google</div>
            <div class="pt-4 border-t border-t-neutral-200">
                <BaseButton @click="addCourse" primary>{{ loading ? 'Vinculando materia...' : 'Vincular materia' }}</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
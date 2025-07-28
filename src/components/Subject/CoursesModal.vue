<script setup>
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { useUserStore } from "@/stores/userStore";
import { useSubjectStore } from "@/stores/subjectStore";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import { BookX, LoaderCircle, X } from "lucide-vue-next";
import EmptyState from "../EmptyState.vue";
import GoogleLogin from "../SignAccount/GoogleLogin.vue";

const route = useRoute();
const path = route.params.id;
const loading = ref(false);
const loadingCourses = ref(false);
const courses = ref([])
const userStore = useUserStore();
const subjectStore = useSubjectStore();
const courseSelected = ref(null);

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close", "update"]);

const closeModal = () => {
    emit("close");
};

const selectCourse = (course) => {
    courseSelected.value = { id: course.id, name: course.name };
};

const fetchCourses = async () => {
    await userStore.fetchUser();
    loadingCourses.value = true;
    try {
        const res = await fetch('https://classroom.googleapis.com/v1/courses', {
            headers: {
                Authorization: `Bearer ${userStore?.user.google.accessToken}`
            }
        });
        const data = await res.json();
        courses.value = data.courses?.filter(course => course.courseState === 'ACTIVE') || [];
    } catch (error) {
        console.error('Error al obtener cursos:', error);
    } finally {
        loadingCourses.value = false;
    }
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
        emit("update");
        closeModal();
    } catch (error) {
        console.error("Error al vincular la materia:", error);
    } finally {
        loading.value = false;
    }
};

const handleTokenFromGoogle = async (accessToken) => {
    try {
        const apiUrl = new URL('/api/users/google-link', process.env.VUE_APP_API_URL);
        const result = await axios.post(apiUrl.toString(), { accessToken, email: userStore.user.email });

        if (result.status === 200) {
            await fetchCourses();
        }
    } catch (error) {
        console.error('Error al iniciar sesión con Google:', error);
    }
};

onMounted(async () => {
    await fetchCourses();
    watch([() => courses.value, () => subjectStore.subject?.classroomId], ([newCourses, classroomId]) => {
        if (!newCourses.length || !classroomId) return;

        const selected = newCourses.find(course => course.id === String(classroomId));
        if (selected) {
        courseSelected.value = { id: selected.id, name: selected.name };
        }
    }, { immediate: true });
});
</script>

<template>
    <BaseModal :show="props.showModal" animation="slide-up" class="items-end justify-center" @close="closeModal">
        <div class="grid grid-rows-[auto_1fr_auto] bg-white p-4 rounded-t-xl w-full h-auto max-h-[80%]">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">{{ userStore.user.google.isGoogleLinked ? 'Vincular materia' : 'Vincular con Google' }}</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div v-if="userStore.user.google.isGoogleLinked" class="bg-white py-4 overflow-scroll">
                <div v-if="loadingCourses" class="w-full my-8 flex items-center justify-center">
                    <div class="flex items-center justify-center size-8 text-libelo-500">
                        <LoaderCircle class="animate-spin" :size="32" />
                    </div>
                </div>
                <ul v-else-if="courses.length" class="flex flex-col gap-2">
                    <li v-for="course in courses" :key="course.id" @click="selectCourse(course)" :class="['p-2 rounded-lg transition-all cursor-pointer', courseSelected?.id === course.id ? 'bg-libelo-500 text-white' : 'bg-neutral-100 hover:bg-libelo-500 hover:text-white']">{{ course.name }}</li>
                </ul>
                <EmptyState v-else title="No tienes clases" :icon="BookX">Únete a una clase en Google Classroom y la verás listada aquí.</EmptyState>
            </div>
            <div v-else class="text-center p-4">
                <p class="text-lg font-semibold mb-2 text-pretty">Esta cuenta no está vinculada con Google</p>
                <p class="text-sm">Para ver tus cursos de Google Classroom, primero necesitas vincular tu cuenta de Google. Haz clic en el botón "Vincular con Google" para comenzar.</p>
            </div>
            <div v-if="!userStore.user.google.isGoogleLinked || courses.length > 0" class="pt-4 border-t border-t-neutral-200">
                <BaseButton v-if="userStore.user.google.isGoogleLinked" @click="addCourse" primary>{{ loading ? 'Vinculando materia...' : 'Vincular materia' }}</BaseButton>
                <GoogleLogin v-else :onTokenReceived="handleTokenFromGoogle" secondary>Vincular con Google</GoogleLogin>
            </div>
        </div>
    </BaseModal>
</template>
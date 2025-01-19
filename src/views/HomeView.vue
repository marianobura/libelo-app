<script setup>
import HomeNav from "@/components/Home/HomeNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import HomeModal from "@/components/Home/HomeModal.vue";
import { LoaderCircle, Plus } from "lucide-vue-next";
import { goTo } from "@/router/index";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from '../stores/userStore';
import BaseButton from "@/components/BaseButton.vue";

const userStore = useUserStore();
const showModal = ref(false);
const subjects = ref([]);
const loading = ref(true);

const fetchSubjects = async () => {
    try {
        const apiUrl = new URL(`/api/subjects`, process.env.VUE_APP_API_URL);
        apiUrl.searchParams.append("studentId", userStore.user._id);
        const response = await axios.get(apiUrl.toString());
        subjects.value = response.data.data;
    } catch (error) {
        console.error("Error al obtener las materias:", error);
    } finally {
        loading.value = false;
    }
};

const addSubject = async (subjectName) => {
    try {
        const apiUrl = new URL(`/api/subjects`, process.env.VUE_APP_API_URL);
        const response = await axios.post(apiUrl.toString(), {
            name: subjectName,
            studentId: userStore.user._id,
            teacherId: null,
        });
        subjects.value.push(response.data.data);
        showModal.value = false;
    } catch (error) {
        console.error("Error al agregar la materia:", error);
    }
};

onMounted(async () => {
    await userStore.fetchUser();
    fetchSubjects();
});
</script>

<template>
    <BaseBody>
        <HomeNav />
        <div class="flex flex-col gap-4 p-2">
            <div class="h-[180px] w-full bg-libelo-500 rounded-xl bg-banner bg-bottom">
                <div class="p-3 flex flex-col text-neutral-100">
                    <p>¡Bienvenido <span class="text-orange-400 font-semibold">{{ userStore.user?.firstName }}</span>!</p>
                    <p class="text-neutral-300 text-sm text-balance">Empieza ahora y conecta con mentores expertos en la materia que elijas, ¡ellos te ayudarán!</p>
                </div>
            </div>
            <BaseTitle title="Tus materias" description="Descubre una variedad de materias y encuentra el mentor perfecto para tus necesidades educativas.">
                <div v-if="loading" class="mt-12 flex items-center justify-center w-full h-full text-libelo-500">
                    <div class="animate-spin">
                        <LoaderCircle :size="32" />
                    </div>
                    <div class="ml-2">
                        <p class="font-semibold">Cargando...</p>
                    </div>
                </div>
                <div v-else-if="subjects.length === 0" @click="showModal = true" class="flex flex-col items-center justify-center gap-2 w-full bg-neutral-200 border border-neutral-300 font-semibold p-2 rounded-xl">
                    <span>Todavía no tienes ninguna materia creada.</span>
                    <BaseButton primary>Agrega tu primera materia</BaseButton>
                </div>
                <div v-else class="grid grid-cols-2 gap-2 w-full text-white font-semibold">
                    <div v-for="subject in subjects" :key="subject._id" @click="goTo(`/subject/${subject._id}`)" class="flex items-center justify-center w-full h-20 p-4 rounded-xl bg-red-800 uppercase">
                        <div class="line-clamp-2 text-center break-words">
                            {{ subject.name }}
                        </div>
                    </div>
                </div>
            </BaseTitle>
        </div>
        <button v-if="subjects.length > 0" id="show-modal" @click="showModal = true" class="fixed bottom-0 right-0 size-12 flex items-center justify-center bg-libelo-500 rounded-full mr-2 mb-2 text-white">
            <Plus :size="24" />
        </button>

        <HomeModal :show-modal="showModal" @close="showModal = false" @add-subject="addSubject" />
    </BaseBody>
</template>

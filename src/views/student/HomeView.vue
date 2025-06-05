<script setup>
import BaseNav from "@/components/BaseNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import HomeModal from "@/components/Home/HomeModal.vue";
import { LoaderCircle, Plus } from "lucide-vue-next";
import { goTo } from "@/router/index";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from '@/stores/userStore';
import BaseButton from "@/components/BaseButton.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
import HomeCard from "@/components/Home/HomeCard.vue";

const userStore = useUserStore();
const showModal = ref(false);
const subjects = ref([]);
const loading = ref(true);

const refreshSubjects = async (newSubject) => {
    subjects.value.push(newSubject);
};

const fetchSubjects = async () => {
    try {
        const apiUrl = new URL(`/api/subjects?studentId=${userStore.user._id}`, process.env.VUE_APP_API_URL);
        const response = await axios.get(apiUrl.toString());
        subjects.value = response.data.data;
    } catch (error) {
        console.error("Error al obtener las materias:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    await userStore.fetchUser();
    await fetchSubjects();
    loading.value = false;
});
</script>

<template>
    <BaseBody>
        <BaseNav home />
        <div class="flex flex-col gap-4 p-2">
            <HomeHeader />
            <BaseTitle title="Tus materias" description="Descubre una variedad de materias y encuentra el mentor perfecto para tus necesidades educativas.">
                <div v-if="loading" class="mt-12 flex items-center justify-center w-full h-full text-libelo-500">
                    <div class="animate-spin">
                        <LoaderCircle :size="32" />
                    </div>
                    <div class="ml-2">
                        <p class="font-semibold">Cargando...</p>
                    </div>
                </div>
                <div v-else-if="subjects.length === 0" class="flex flex-col items-center justify-center gap-2 w-full bg-neutral-200 border border-neutral-300 font-semibold p-2 rounded-xl">
                    <span>Todavía no tienes ninguna materia creada.</span>
                    <BaseButton @click="showModal = true" primary>Agrega tu primera materia</BaseButton>
                </div>
                <div v-else class="grid grid-cols-2 gap-2 w-full text-white font-semibold">
                    <HomeCard v-for="subject in subjects" :key="subject._id" @click="goTo(`/student/subject/${subject._id}`)" :content=subject.name />
                </div>
            </BaseTitle>
        </div>
        <button v-if="subjects.length > 0" id="show-modal" @click="showModal = true" class="fixed bottom-0 right-0 size-12 flex items-center justify-center bg-libelo-500 rounded-full mr-2 mb-2 text-white">
            <Plus :size="24" />
        </button>

        <HomeModal :show-modal="showModal" @close="showModal = false" @refresh="refreshSubjects" />
    </BaseBody>
</template>

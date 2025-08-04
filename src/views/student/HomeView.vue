<script setup>
import BaseNav from "@/components/BaseNav.vue";
import BaseBody from "@/components/BaseBody.vue";
import BaseTitle from "@/components/BaseTitle.vue";
import HomeModal from "@/components/Home/HomeModal.vue";
import { LoaderCircle, Plus } from "lucide-vue-next";
import { goTo } from "@/router/index";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from '@/stores/userStore';
import { useSubjectStore } from '@/stores/subjectStore';
import BaseButton from "@/components/BaseButton.vue";
import HomeHeader from "@/components/Home/HomeHeader.vue";
import HomeCard from "@/components/Home/HomeCard.vue";

const showModal = ref(false);
const userStore = useUserStore();
const subjectStore = useSubjectStore();
const loading = ref(true);

onMounted(async () => {
    await userStore.fetchUser();
    await subjectStore.fetchSubjects();
    loading.value = false;
});

const subjects = computed(() => subjectStore.getSubjects);
const refreshSubjects = (newSubject) => {
    subjectStore.addSubject(newSubject)
};
</script>

<template>
    <BaseBody>
        <BaseNav home />
        <div class="flex flex-col gap-4 p-2">
            <HomeHeader />
            <BaseTitle title="Tus materias" description="Descubre una variedad de materias y encuentra el mentor perfecto para tus necesidades educativas.">
                <div v-if="loading" class="mt-12 flex items-center justify-center w-full h-full text-libelo-500">
                    <LoaderCircle class="animate-spin" :size="32" />
                </div>
                <BaseButton v-else-if="subjects.length === 0" @click="showModal = true" primary>Agrega tu primera materia</BaseButton>
                <div v-else class="grid grid-cols-2 gap-2 w-full text-white font-semibold">
                    <HomeCard v-for="subject in subjects" :key="subject._id" @click="goTo(`/student/subject/${subject._id}`)" :content="subject.name" :banner="subject.banner" :color="subject.color"/>
                </div>
            </BaseTitle>
        </div>
        <div v-if="subjects.length > 0" class="fixed bottom-0 right-0 bg-body p-2 rounded-full rounded-br-none z-10">
            <button @click="showModal = true" class="size-12 flex items-center justify-center bg-libelo-500 rounded-full text-white">
                <Plus :size="24" />
            </button>
        </div>

        <HomeModal :show-modal="showModal" @close="showModal = false" @refresh="refreshSubjects" />
    </BaseBody>
</template>

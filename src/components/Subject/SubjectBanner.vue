<script setup>
import { computed, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { useRoute } from "vue-router";
import { Settings } from "lucide-vue-next";
import SettingsModal from "@/components/Subject/SettingsModal.vue";

const route = useRoute();
const userStore = useUserStore();
const subjectStore = useSubjectStore();

watch(() => [route.params.id, userStore.user], ([id, user]) => {
    if (id && user) {
        if (user.role === "student") {
            subjectStore.fetchSubject(id);
        }
    }}, { immediate: true }
);

const subjectName = computed(() => {
    if (userStore.user) {
        if (userStore.user?.role === 'student') {
            return subjectStore.getSubjectData?.name ?? "Materia";
        } else if (userStore.user?.role === 'teacher') {
            return Object.keys(userStore.user?.preferredSubjects)[route.params.id] ?? "Materia";
        }
    }
    return "Materia";
});
</script>

<template>
    <div class="flex flex-col justify-end p-3 h-28 w-full bg-red-800 rounded-xl relative">
        <div class="absolute size-8 flex items-center justify-center top-0 right-0 mt-2 mr-2 rounded-xl" @click="">
            <Settings class="text-white" size="20" />
        </div>
        <span class="text-white font-semibold text-xl uppercase break-all line-clamp-1">
            {{ subjectStore.loading ? "Cargando..." : subjectName }}
        </span>
        <span v-if="subjectStore.subject?.classroomName" class="italic text-sm text-neutral-200 break-all line-clamp-1">Materia sincronizada: {{ subjectStore.subject?.classroomName }}</span>
    </div>

    <SettingsModal :show-modal="showModal" @close="showModal = false" />
</template>
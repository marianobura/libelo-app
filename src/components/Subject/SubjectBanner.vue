<script setup>
import { computed, watch } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { useRoute } from "vue-router";
import { Pencil } from "lucide-vue-next";
import SettingsModal from "@/components/Subject/SettingsModal.vue";
import { ref } from "vue";

const route = useRoute();
const userStore = useUserStore();
const subjectStore = useSubjectStore();
const showModal = ref(false);

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

const gradientStyle = computed(() => ({
    backgroundImage: `linear-gradient(to bottom, ${subjectStore.subject?.color})`
}));

const bannerStyle = computed(() => ({
    backgroundImage: `url(${subjectStore.subject?.banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'right',
    opacity: 0.2,
    filter: 'grayscale(100%)',
}));

function getContrastingTextColor(bgColor) {
    if (!bgColor) return "white";
    const colors = bgColor.split(",");
    const hex = colors[0].trim();
    const hexValue = hex.replace("#", "");
    if (hexValue.length !== 6) return "white";

    const r = parseInt(hexValue.substring(0, 2), 16);
    const g = parseInt(hexValue.substring(2, 4), 16);
    const b = parseInt(hexValue.substring(4, 6), 16);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 186 ? "black" : "white";
}

const textColor = computed(() => {
    const color = subjectStore.subject?.color;
    return getContrastingTextColor(color);
});
</script>

<template>
    <div class="flex flex-col justify-end p-3 h-28 w-full rounded-xl relative overflow-hidden bg-libelo-500">
        <div v-if="userStore.user.role === 'student'" class="absolute inset-0" :style="gradientStyle" />
        <div v-if="subjectStore.subject?.banner && userStore.user.role === 'student'" class="absolute inset-0" :style="bannerStyle" />
        <div v-if="userStore.user.role === 'student'" class="absolute size-8 flex items-center justify-center top-0 right-0 mt-2 mr-2 rounded-xl z-10 bg-black/30" @click="showModal = true">
            <Pencil class="text-white" size="16" />
        </div>
        <span class="font-semibold text-xl uppercase break-all line-clamp-1 z-10" :style="{ color: textColor }">
            {{ subjectStore.loading ? "Cargando..." : subjectName }}
        </span>
        <span v-if="subjectStore.subject?.classroomName" class="italic text-sm text-neutral-200 break-all line-clamp-1 z-10">Materia sincronizada: {{ subjectStore.subject?.classroomName }}</span>
    </div>

    <SettingsModal :show-modal="showModal" @close="showModal = false" />
</template>
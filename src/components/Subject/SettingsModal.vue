<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { X } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import { useSubjectStore } from "@/stores/subjectStore";

const route = useRoute();
const path = route.params.id;
const loading = ref(false);
const selectedBanner = ref(null);
const selectedColor = ref(null);
const subjectStore = useSubjectStore();

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

watch(() => props.showModal, async (show) => {
    if (show) {
        await subjectStore.fetchSubject(path);
        const s = subjectStore.subject;
        selectedBanner.value = s?.banner || null;
        selectedColor.value = s?.color || null;
    }
});

const settings = {
    banners: [
        "/banners/Geography_thumb.jpg",
        "/banners/Geometry_thumb.jpg",
        "/banners/img_backtoschool.jpg",
        "/banners/img_bookclub.jpg",
        "/banners/img_breakfast_thumb.jpg",
        "/banners/img_carmaintenance_thumb.jpg",
        "/banners/img_code.jpg",
        "/banners/img_reachout_thumb.jpg",
        "/banners/img_violin2_thumb.jpg",
        "/banners/img_volleyball_thumb.jpg",
        "/banners/Math_thumb.jpg",
        "/banners/SocialStudies_thumb.jpg",
        "/banners/WorldHistory_thumb.jpg",
        "/banners/WorldStudies_thumb.jpg",
        "/banners/Writing_thumb.jpg"
    ],
    colors: [
        "#C82A2A, #962222",
        "#2A3AC8, #1F2B96",
        "#2AC84D, #1F9439",
        "#C8632A, #92481F",
        "#C8C22A, #989320",
        "#6E2AC8, #4F1E8F",
        "#C82AAF, #8F1D7D",
        "#7C7C7C, #515151",
        "#1ABC9C, #148F77",
        "#3498DB, #2C80B4",
        "#E67E22, #CA6F1E",
        "#9B59B6, #8E44AD",
        "#34495E, #2C3E50",
        "#95A5A6, #7F8C8D",
        "#E74C3C, #C0392B"
    ]
};

const saveSettings = async () => {
    loading.value = true;
    try {
        const apiUrl = new URL(`/api/subjects/${path}/banner-color`, process.env.VUE_APP_API_URL);
        await axios.patch(apiUrl.toString(), {
            banner: selectedBanner.value,
            color: selectedColor.value
        });

        subjectStore.subject.banner = selectedBanner.value;
        subjectStore.subject.color = selectedColor.value;

        closeModal();
    } catch (error) {
        console.error("Error al guardar la configuración:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <BaseModal :show="showModal" animation="slide-up" class="items-end justify-center" @click="handleOverlayClick">
        <div class="grid grid-rows-[auto_1fr_auto] bg-white p-4 rounded-t-xl w-full h-[80%]">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">Configuración de la materia</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="pt-4 overflow-auto">
                <div class="flex flex-col gap-2">
                    <span class="font-semibold">Elige una portada para tu materia</span>
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="url in settings.banners" :key="url" class="h-16 w-full bg-cover bg-right rounded-md cursor-pointer" :class="{ 'opacity-100': selectedBanner === null || selectedBanner === url, 'opacity-50': selectedBanner !== null && selectedBanner !== url }" :style="{ backgroundImage: `url(${url})` }" @click="selectedBanner = selectedBanner === url ? null : url " />
                    </div>
                </div>
                <div class="flex flex-col gap-2 mt-4">
                    <span class="font-semibold">Elige un color para tu materia</span>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="color in settings.colors" :key="color" class="size-8 rounded-xl cursor-pointer" :class="{ 'opacity-100': selectedColor === null || selectedColor === color, 'opacity-50': selectedColor !== null && selectedColor !== color }" :style="{ backgroundImage: `linear-gradient(to bottom, ${color})` }" @click="selectedColor = selectedColor === color ? null : color" />
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-t-neutral-200">
                <BaseButton @click="saveSettings" :loading="loading" primary>{{ loading ? 'Guardando configuración...' : 'Guardar configuración' }}</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

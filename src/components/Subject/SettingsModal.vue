<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { X } from "lucide-vue-next";
import BaseButton from "@/components/BaseButton.vue";
import { useRoute } from 'vue-router';
import axios from "axios";
import { useSubjectStore } from "@/stores/subjectStore";
import { Check } from "lucide-vue-next";

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
        "https://www.gstatic.com/classroom/themes/Biology_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Chemistry_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Design_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/English_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Geography_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Geometry_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Honors_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/LanguageArts_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Math_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Physics_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Psychology_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/SocialStudies_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/USHistory_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/WorldHistory_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/WorldStudies_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/Writing_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_americanfootball_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_arts_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_athleticsjumping_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_backtoschool_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_bbq_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_billiard_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_birthday_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_bookclub_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_bowling_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_boxing_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_breakfast_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_cinema_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_climbing_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_code_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_coffee_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_concert_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_cooking_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_cricket_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_cycling_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_cyclingbmx_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_dancing_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_equestrian_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_fencing_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_golf_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_graduation_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_gym_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_karate_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_kayaking_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_learninstrument_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_learnlanguage_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_mealfamily_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_pingpong_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_reachout_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_read_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_rowing_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_soccer_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_swimming_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_tennis_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_theatreopera_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_triathlon_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_violin2_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_volleyball_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_waterpolo_thumb.jpg",
        "https://www.gstatic.com/classroom/themes/img_wrestling_thumb.jpg"
    ],
    colors: [
        "#083DB2, #1F2B96",
        "#C82A2A, #962222",
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
    if (!selectedColor.value) {
        selectedColor.value = "#083DB2, #1F2B96"
    }

    try {
        const apiUrl = new URL(`/api/subjects/${path}/banner-color`, process.env.VUE_APP_API_URL);
        await axios.patch(apiUrl.toString(), {
            banner: selectedBanner.value,
            color: selectedColor.value
        });

        const updatedSubject = {
            ...subjectStore.subject,
            banner: selectedBanner.value,
            color: selectedColor.value,
        };

        subjectStore.subject.banner = selectedBanner.value;
        subjectStore.subject.color = selectedColor.value;

        subjectStore.updateSubject(updatedSubject);

        closeModal();
    } catch (error) {
        console.error("Error al guardar la configuración:", error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <BaseModal :show="showModal" animation="slide-up" class="items-end justify-center" @close="closeModal">
        <div class="grid grid-rows-[auto_1fr_auto] bg-white p-4 rounded-t-xl w-full h-[80%]">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">Configuración de la materia</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="py-2 overflow-auto">
                <div class="flex flex-col gap-2">
                    <span class="font-semibold">Elige un color para tu materia</span>
                    <div class="grid grid-cols-6 gap-2">
                        <div v-for="color in settings.colors" :key="color" class="h-8 w-full rounded-xl cursor-pointer flex items-center justify-center text-white" :class="{ 'opacity-100': selectedColor === null || selectedColor === color, 'opacity-50': selectedColor !== null && selectedColor !== color }" :style="{ backgroundImage: `linear-gradient(to bottom, ${color})` }" @click="selectedColor = selectedColor === color ? null : color">
                            <Check v-if="selectedColor === color" stroke-width="3" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 mt-4">
                    <span class="font-semibold">Elige una portada para tu materia</span>
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="url in settings.banners" :key="url" class="h-16 w-full bg-cover bg-right rounded-md cursor-pointer overflow-hidden" :class="{ 'opacity-100': selectedBanner === null || selectedBanner === url, 'opacity-50': selectedBanner !== null && selectedBanner !== url }" :style="{ backgroundImage: `url(${url})` }" @click="selectedBanner = selectedBanner === url ? null : url">
                            <div v-if="selectedBanner === url" class="flex items-center justify-center w-full h-full bg-black/50 text-white">
                                <Check stroke-width="3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-t-neutral-200">
                <BaseButton @click="saveSettings" :loading="loading" primary>{{ loading ? 'Guardando configuración...' : 'Guardar configuración' }}</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

<script setup>
/* eslint-disable */
import { defineProps, defineEmits } from "vue";
import { ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "../BaseButton.vue";
import { Angry, Frown, Laugh, Meh, Smile } from "lucide-vue-next";

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

const rating = ref(3);

const getRatingColor = (type) => {
    switch (rating.value) {
        case 1: return `${type}-rose-600`;
        case 2: return `${type}-amber-600`;
        case 3: return `${type}-yellow-500`;
        case 4: return `${type}-lime-600`;
        case 5: return `${type}-libelo-500`;
        default: return `${type}-yellow-500`;
    }
}
</script>

<template>
    <BaseModal v-if="props.showModal" class="justify-center items-center" @click="handleOverlayClick">
        <div class="bg-white rounded-xl w-full h-fit mx-2 overflow-hidden">
            <div :class="['relative w-full h-28', getRatingColor('bg')]">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 aspect-square w-fit h-auto bg-white rounded-full">
                    <div class="flex justify-center items-center size-28">
                        <Angry v-if="rating === 1" :size="96" :stroke-width="1.5" class="text-rose-600" />
                        <Frown v-else-if="rating === 2" :size="96" :stroke-width="1.5" class="text-amber-600" />
                        <Meh v-else-if="rating === 3" :size="96" :stroke-width="1.5" class="text-yellow-500" />
                        <Smile v-else-if="rating === 4" :size="96" :stroke-width="1.5" class="text-lime-600" />
                        <Laugh v-else :size="96" :stroke-width="1.5" class="text-libelo-500" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-4 p-4 mt-12">
                <h2 class="text-lg font-semibold text-center text-balance">¿Cómo calificarías la atención del profesor?</h2>
                <div class="flex justify-center gap-4">
                    <template v-for="num in 5" :key="num">
                        <label>
                            <input type="radio" :value="num" v-model="rating" class="peer hidden" />
                            <div class="size-10 flex items-center justify-center rounded-full border-2 border-libelo-500 text-libelo-500 font-semibold peer-checked:bg-libelo-500 peer-checked:text-white cursor-pointer transition">{{ num }}</div>
                        </label>
                    </template>
                </div>
                <BaseButton primary class="mt-4">Enviar calificación</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
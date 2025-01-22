<script setup>
import { defineProps, defineEmits } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import { X } from "lucide-vue-next";

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
</script>

<template>
    <BaseModal v-if="props.showModal" class="items-end justify-center" @click="handleOverlayClick">
        <div class="grid grid-rows-[auto_auto] bg-white p-4 rounded-t-xl w-full">
            <div class="flex justify-between items-center pb-4 border-b border-b-neutral-200">
                <p class="text-lg font-semibold">¿Eres estudiante o profesor/a?</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="pt-4 grid grid-cols-2 w-full gap-4">
                <div class="flex flex-col justify-center items-center gap-2 w-full px-2 py-6 rounded-xl bg-neutral-100 border border-neutral-300">
                    <div class="flex items-end justify-center size-12 bg-libelo-500 rounded-full">
                        <img src="/img/student.svg" alt="Ilustración de un chico y una chica" class="h-10" />
                    </div>
                    <p>Estudiante</p>
                </div>
                <div class="flex flex-col justify-center items-center gap-2 w-full px-2 py-6 rounded-xl bg-neutral-100 border border-neutral-300">
                    <div class="flex gap-2">
                        <div class="flex items-end justify-center size-12 bg-libelo-500 rounded-full">
                            <img src="/img/teacher-m.svg" alt="Ilustración de un chico" class="h-10" />
                        </div>
                        <div class="flex items-end justify-center size-12 bg-libelo-500 rounded-full">
                            <img src="/img/teacher-w.svg" alt="Ilustración de una chica" class="h-10" />
                        </div>
                    </div>
                    <p>Profesor/a</p>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
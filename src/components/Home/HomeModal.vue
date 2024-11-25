<script setup>
import BaseButton from "@/components/BaseButton.vue";
import { X } from "lucide-vue-next";
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
    showModal: Boolean
});

const emit = defineEmits(["close", "add-subject"]);
const subjectName = ref("");

const closeModal = () => {
    emit("close");
};

const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const handleAddSubject = () => {
    if (subjectName.value.trim()) {
        emit("add-subject", subjectName.value.trim());
        subjectName.value = "";
        closeModal();
    }
};
</script>

<template>
    <div v-if="props.showModal" class="fixed inset-0 flex items-end justify-center bg-black bg-opacity-60 z-50" @click="handleOverlayClick">
        <div class="bg-white p-2 rounded-t-xl w-full">
            <div class="flex justify-between items-center py-2">
                <p class="text-lg font-semibold">Nueva materia</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <hr>
            <div class="py-2">
                <input v-model="subjectName" type="text" class="w-full border border-neutral-400 rounded-xl p-3 " placeholder="Ingrese una nueva materia">
            </div>
            <div class="py-2">
                <BaseButton @click="handleAddSubject" primary>Agregar materia</BaseButton>
            </div>
        </div>
    </div>
</template>
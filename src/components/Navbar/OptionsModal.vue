<script setup>
import { defineProps, defineEmits } from "vue";

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
    <div v-if="props.showModal" class="fixed inset-0 flex justify-end bg-black bg-opacity-60 z-50" @click="handleOverlayClick">
        <div class="flex flex-col bg-white p-2 rounded-xl w-fit h-fit mt-16 mr-2 border border-neutral-300 space-y-2">
            <router-link to="/" class="hover:bg-neutral-200 p-2 rounded-[calc(0.75rem-8px)]">Vincular con Classroom</router-link>
            <router-link to="/" class="hover:bg-neutral-200 p-2 rounded-[calc(0.75rem-8px)]">Vincular con Classroom</router-link>
        </div>
    </div>
</template>
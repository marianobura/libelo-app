<script setup>
import { defineProps, defineEmits } from "vue";
import BaseModal from "@/components/BaseModal.vue";

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
    <BaseModal v-if="props.showModal" class="justify-end" @click="handleOverlayClick">
        <div class="flex flex-col bg-white p-2 rounded-xl w-fit h-fit mt-16 mr-2 border border-neutral-300 space-y-2 shadow-md">
            <router-link to="/" class="hover:bg-neutral-200 p-2 rounded-[calc(0.75rem-8px)]">Vincular con Classroom</router-link>
        </div>
    </BaseModal>
</template>
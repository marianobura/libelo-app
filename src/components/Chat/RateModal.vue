<script setup>
import { defineProps, defineEmits } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseTitle from "../BaseTitle.vue";
import BaseButton from "../BaseButton.vue";

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
    <BaseModal v-if="props.showModal" class="justify-center items-center" @click="handleOverlayClick">
        <div class="bg-white p-4 rounded-xl w-full h-fit mx-2">
            <BaseTitle title="Califica al profesor" description="Si crees que el profesor actual no es el adecuado para ayudarte, puedes cambiarlo. Se te asignará otro profesor y la conversación continuará desde donde la dejaste." />
            <BaseButton primary class="mt-4">Calificar al profesor</BaseButton>
        </div>
    </BaseModal>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import BaseTitle from "../BaseTitle.vue";
import BaseButton from "../BaseButton.vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();
const chatId = route.params.id;

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

const removeTeacher = async () => {
    try {
        const apiUrl = new URL(`/api/chats/remove-teacher/${chatId}`, process.env.VUE_APP_API_URL);
        const response = await axios.patch(apiUrl.toString());
        if (response.status === 200) {
            window.location.reload();
            closeModal();
        }
    } catch (error) {
        console.error("Hubo un error al intentar eliminar al profesor del chat:", error);
    }
};
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @click="handleOverlayClick">
        <div class="bg-white p-4 rounded-xl w-full h-fit mx-2">
            <BaseTitle title="Cambia de profesor" description="Si crees que el profesor actual no es el adecuado para ayudarte, puedes cambiarlo. Se te asignará otro profesor y la conversación continuará desde donde la dejaste." />
            <BaseButton primary class="mt-4" @click="removeTeacher">Cambiar de profesor</BaseButton>
        </div>
    </BaseModal>
</template>
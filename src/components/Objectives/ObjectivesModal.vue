<script setup>
import { defineProps, defineEmits, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseModal from "@/components/BaseModal.vue";
import axios from "axios";

const props = defineProps({
    showModal: Boolean,
    subjectId: String
});

const objectiveText = ref("");
const emit = defineEmits(["close", "objective-added"]);
const errorMessage = ref('');

const closeModal = () => {
    emit("close");
};

const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const addObjective = async () => {
    if (!objectiveText.value || objectiveText.value.trim().length === 0) {
        errorMessage.value = "Debes ingresar un texto válido.";
        return;
    }
    
    try {
        const apiUrl = new URL(`/api/subjects/${props.subjectId}/objective`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl.toString(), {
            text: objectiveText.value,
            completed: false
        });
        
        emit("objective-added", response.data.data.objectives.at(-1));
    } catch (error) {
        console.error("Error al agregar el objetivo:", error);
    } finally {
        objectiveText.value = "";
        closeModal();
    }
};
</script>

<template>
    <BaseModal :show="props.showModal" class="items-center justify-center" @click="handleOverlayClick">
        <div class="bg-white mx-2 p-4 rounded-xl w-full">
            <h2 class="text-lg font-semibold mb-3">Agregar nueva opción</h2>
            <BaseInput type="text" placeholder="Introduzca su objetivo..." identifier="objectives"
                v-model="objectiveText" />
            <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
                {{ errorMessage }}
            </p>
            <div class="flex justify-end mt-3 gap-2">
                <BaseButton @click="closeModal">Cancelar</BaseButton>
                <BaseButton @click="addObjective" primary>Agregar</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
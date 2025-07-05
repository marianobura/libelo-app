<script setup>
import { defineProps, defineEmits, ref } from "vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseModal from "@/components/BaseModal.vue";
import axios from "axios";
import { X } from "lucide-vue-next";

const props = defineProps({
    showModal: Boolean,
    subjectId: String
});

const objectiveText = ref("");
const emit = defineEmits(["close", "objective-added"]);

const closeModal = () => {
    emit("close");
};

const addObjective = async () => {
    if (!objectiveText.value.trim()) return;
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
    <BaseModal :show="props.showModal" class="items-center justify-center" @close="closeModal">
        <div class="bg-white mx-2 p-4 rounded-xl w-full">
            <div class="flex justify-between items-center pb-4">
                <h2 class="text-lg font-semibold">Agrega un objetivo</h2>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <BaseInput type="text" placeholder="Introduzca su objetivo..." identifier="objectives" v-model="objectiveText" />
            <BaseButton @click="addObjective" primary class="mt-3">Agregar</BaseButton>
        </div>
    </BaseModal>
</template>
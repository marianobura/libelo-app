<script setup>
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    showModal: Boolean,
});

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => emit("close");
const confirm = () => emit("confirm");
</script>

<template>
    <BaseModal :show="props.showModal" class="items-center justify-center" @close="closeModal">
        <div class="bg-white p-4 rounded-xl mx-2">
            <div class="flex flex-col gap-1 w-full p-2">
                <p class="font-semibold">Eliminar objetivos</p>
                <p class="text-sm text-neutral-700">¿Está seguro de eliminar todos los objetivos actuales?</p>
            </div>
            <div class="flex justify-end mt-3 gap-4">
                <BaseButton @click="closeModal" secondary>Cancelar</BaseButton>
                <BaseButton @click="confirm" danger>Eliminar</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

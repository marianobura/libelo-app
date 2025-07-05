<script setup>
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { defineProps, defineEmits } from "vue";
import { TriangleAlert } from "lucide-vue-next";

const props = defineProps({
    showModal: Boolean,
});

const emit = defineEmits(["close", "confirm"]);

const closeModal = () => emit("close");
const confirm = () => emit("confirm");
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @close="closeModal">
        <div class="w-full m-2 rounded-xl overflow-hidden">
            <div class="flex gap-4 bg-white p-4">
                <div class="size-12 flex items-center justify-center bg-red-100 rounded-full text-red-500 flex-shrink-0">
                    <TriangleAlert size="24" />
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold">Eliminar objetivos</p>
                    <p class="text-sm text-neutral-700">Esta acción no se puede deshacer y se eliminarán todos los objetivos de la materia. ¡Pero no te preocupes! Siempre podrás crear nuevos objetivos cuando los necesites.</p>
                </div>
            </div>
            <div class="bg-neutral-100 p-4">
                <div class="flex justify-end gap-2">
                    <BaseButton @click="closeModal">Cancelar</BaseButton>
                    <BaseButton danger @click="confirm">Eliminar</BaseButton>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

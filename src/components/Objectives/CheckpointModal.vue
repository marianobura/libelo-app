<script setup>
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { Check, X } from "lucide-vue-next";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    showModal: Boolean,
    objective: Object,
    index: Number,
});

const emit = defineEmits(["close"]);

const closeModal = () => emit("close");
</script>

<template>
    <BaseModal :show="props.showModal" class="items-center justify-center" @close="closeModal">
        <div class="bg-white p-4 rounded-xl w-full mx-2">
            <h2 class="text-lg font-semibold break-all line-clamp-1">Objetivo {{ props.index + 1 }}: {{ props.objective?.text }}</h2>
            <div class="flex items-center gap-2 mt-3 mb-3">
                <span v-if="props.objective?.completed" class="text-libelo-500 font-bold flex items-center">
                    <Check class="mr-1" /> Completado
                </span>
                <span v-else class="text-red-500 font-bold flex items-center">
                    <X class="mr-1" /> No completado
                </span>
            </div>
            <div class="flex justify-end mt-3">
                <BaseButton @click="closeModal" secondary>Cerrar</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>

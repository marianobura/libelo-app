<script setup>
import BaseModal from "@/components/BaseModal.vue";
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
            <div class="flex justify-between items-center pb-2 mb-2 border-b border-neutral-300">
                <h2 class="text-lg font-semibold break-all line-clamp-1">Objetivo {{ props.index + 1 }}</h2>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="flex flex-col gap-2">
                <p class="font-semibold break-all">{{ props.objective?.text }}</p>
                <div class="font-semibold flex items-center gap-2 px-3 py-1 rounded-full w-fit" :class="props.objective?.completed ? 'text-libelo-500 bg-libelo-100' : 'text-red-500 bg-red-100'">
                    <Check v-if="props.objective?.completed" size="16" />
                    <X v-else size="16" />
                    <span class="text-sm">{{ props.objective?.completed ? 'Completado' : 'Pendiente'}}</span>
                </div>
            </div>
        </div>
    </BaseModal>
</template>

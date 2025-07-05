<script setup>
import { defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import { TriangleAlert } from 'lucide-vue-next';

const props = defineProps({
    showModal: Boolean,
    event: Object
});

const emit = defineEmits(['close', 'confirm']);

const closeModal = () => {
    emit("close");
};

const handleConfirm = () => emit('confirm');
</script>

<template>
    <BaseModal :show="props.showModal" class="justify-center items-center" @close="closeModal">
        <div class="w-full m-2 rounded-xl overflow-hidden">
            <div class="flex gap-4 bg-white p-4">
                <div class="size-12 flex items-center justify-center bg-red-100 rounded-full text-red-500 flex-shrink-0">
                    <TriangleAlert size="24" />
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <p class="font-semibold">Eliminar evento</p>
                    <p class="text-sm text-neutral-700">Estás por eliminar <span class="underline">{{ props.event?.summary || 'Evento sin título' }}</span>. Esta acción no se puede deshacer y el evento ya no estará en tu calendario.</p>
                </div>
            </div>
            <div class="bg-neutral-100 p-4">
                <div class="flex justify-end gap-2">
                    <BaseButton @click="closeModal">Cancelar</BaseButton>
                    <BaseButton danger @click="handleConfirm">Eliminar</BaseButton>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
<!-- DeleteEventModal.vue -->
<script setup>
import { defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseTitle from '../BaseTitle.vue';

const props = defineProps({
    show: Boolean,
    event: Object
});

const emit = defineEmits(['close', 'confirm']);

const closeModal = () => {
    emit("close");
};

const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const handleConfirm = () => emit('confirm');
</script>

<template>
    <BaseModal :show="props.show" class="items-center justify-center" @click.self="handleOverlayClick">
        <div class="bg-white p-4 rounded-xl max-w-md w-full mx-2 max-h-[80vh] overflow-y-auto">
            <BaseTitle title="¿Estás seguro de eliminar este evento?" description="Si lo eliminas, se borrará definitivamente.">
                <div class="flex flex-col">
                    <p class="text-semibold">
                        <span class="font-semibold">Evento:</span>
                        {{ props.event?.summary || 'Sin título' }}
                    </p>
                    <div class="flex flex-col">
                        <p class="text-sm">
                            <span class="font-semibold">Desde:</span>
                            {{ new Date(props.event?.start.dateTime).toLocaleString("es-AR") }}
                        </p>
                        <p class="text-sm">
                            <span class="font-semibold">Hasta:</span>
                            {{ new Date(props.event?.end.dateTime).toLocaleString("es-AR") }}
                        </p>
                    </div>
                </div>
            </BaseTitle>
            <div class="flex justify-end mt-4 gap-2">
                <BaseButton @click="closeModal" secondary>Cancelar</BaseButton>
                <BaseButton @click="handleConfirm" danger>Eliminar</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
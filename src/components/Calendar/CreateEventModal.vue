<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
    show: Boolean,
    event: Object,
    date: String
});

const emit = defineEmits(['close', 'confirm']);

const localEvent = ref({ summary: '', start: {}, end: {} });
const localDate = ref('');

watch(() => props.show, (visible) => {
    if (visible && props.event) {
        localEvent.value = { ...props.event };
        localDate.value = props.date || '';
    }
});

const errorMessage = ref('');
const handleClose = () => emit('close');

const handleConfirm = () => {
    if (!localDate.value || isNaN(new Date(localDate.value))) {
        errorMessage.value = "Debes ingresar una fecha válida.";
        return;
    }

    const updatedStart = new Date(localDate.value);
    const updatedEnd = new Date(updatedStart.getTime() + 60 * 60 * 1000);

    localEvent.value.start = { dateTime: updatedStart.toISOString() };
    localEvent.value.end = { dateTime: updatedEnd.toISOString() };

    emit('confirm', {
        event: localEvent.value,
        date: localDate.value
    });
};
</script>

<template>
    <BaseModal :show="props.show" class="items-center justify-center" @click.self="handleClose">
        <div class="bg-white p-4 rounded-xl max-w-md w-full mx-2 max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-center pb-4">
                <p class="text-lg font-semibold">Crear un nuevo evento</p>
                <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="handleClose">
                    <X :size="16" :stroke-width="3" />
                </button>
            </div>
            <div class="flex flex-col gap-2">
                <BaseInput v-model="localEvent.summary" placeholder="Nombre del evento" />
                <BaseInput type="datetime-local" v-model="localDate" />
                <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
                    {{ errorMessage }}
                </p>
                <BaseButton @click="handleConfirm" primary>Crear evento</BaseButton>
            </div>
        </div>
    </BaseModal>
</template>
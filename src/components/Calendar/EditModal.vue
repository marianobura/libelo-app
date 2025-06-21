<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import { Trash2, Pencil, Check } from 'lucide-vue-next';

const props = defineProps({
    show: Boolean,
    event: Object,
    isEditing: Boolean,
    date: String
});

const emit = defineEmits(['close', 'update', 'delete']);

const closeModal = () => {
    emit("close");
};

const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
};

const localEvent = ref({ ...props.event });
const localDate = ref(props.date);
const localIsEditing = ref(props.isEditing);

watch(() => props.event, (newVal) => {
    localEvent.value = { ...newVal };
});

watch(() => props.date, (newVal) => {
    localDate.value = newVal;
});

const handleSave = () =>
    emit('update', {
        event: localEvent.value,
        date: localDate.value
    });
const handleDelete = () => emit('delete');
</script>

<template>
    <BaseModal :show="props.show" class="items-center justify-center" @click.self="handleOverlayClick">
        <div class="bg-white p-4 rounded-xl max-w-md w-full mx-2">
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-around mb-2">
                    <span v-if="!localIsEditing" @click="localIsEditing = true">
                        <Pencil />
                    </span>
                    <span v-else @click="handleSave">
                        <Check />
                    </span>
                    <span @click="handleDelete">
                        <Trash2 />
                    </span>
                </div>

                <div v-if="localIsEditing">
                    <input v-model="localEvent.summary" class="border rounded px-2 py-1 w-full" />
                </div>
                <div v-else>
                    <h3 class="text-lg font-bold truncate max-w-full">
                        {{ localEvent.summary }}
                    </h3>
                </div>

                <div v-if="localIsEditing">
                    <input type="datetime-local" v-model="localDate" class="border rounded px-2 py-1 w-full" />
                </div>
                <div v-else>
                    <p class="text-sm text-neutral-700">
                        <strong>Fecha:</strong>
                        {{ new Date(localEvent.start?.dateTime).toLocaleString("es-AR") }} a
                        {{ new Date(localEvent.end?.dateTime).toLocaleString("es-AR") }}
                    </p>
                </div>

                <div class="flex justify-end mt-4">
                    <BaseButton @click="handleClose" secondary>Cerrar</BaseButton>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import { Trash2, Pencil, Check } from 'lucide-vue-next';
import BaseInput from '../BaseInput.vue';

const props = defineProps({
    show: Boolean,
    event: Object,
    isEditing: Boolean,
    date: String
});

const emit = defineEmits(['close', 'update', 'delete']);

const closeModal = () => {
    localIsEditing.value = false;
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
const errorMessage = ref('');

watch(() => props.event, (newVal) => {
    localEvent.value = { ...newVal };
});

watch(() => props.date, (newVal) => {
    localDate.value = newVal;
});

const handleSave = () => {
    if (!localDate.value || isNaN(new Date(localDate.value))) {
        errorMessage.value = "Debes ingresar una fecha válida.";
        return;
    }

    emit('update', {
        event: localEvent.value,
        date: localDate.value
    });
    localIsEditing.value = false;
}

const handleDelete = () => {
    emit('delete')
    closeModal();
};
</script>

<template>
    <BaseModal :show="props.show" class="items-center justify-center" @click.self="handleOverlayClick">
        <div class="bg-white rounded-xl max-w-md w-full mx-2 overflow-hidden">
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-around gap-0.5">
                    <span v-if="!localIsEditing" @click="localIsEditing = true" class="w-full flex items-center justify-center h-12 bg-libelo-100 text-libelo-500 hover:bg-libelo-500 hover:text-white transition-colors">
                        <Pencil />
                    </span>
                    <span v-else @click="handleSave" class="w-full flex items-center justify-center h-12 bg-green-100 text-green-500 hover:bg-green-500 hover:text-white transition-colors">
                        <Check />
                    </span>
                    <span @click="handleDelete" class="w-full flex items-center justify-center h-12 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 />
                    </span>
                </div>
                <div class="pt-2 p-4">
                    <div v-if="localIsEditing" class="mb-2">
                        <BaseInput v-model="localEvent.summary" placeholder="Nombre del evento" />
                    </div>
                    <div v-else class="mb-1">
                        <h3 class="text-lg font-bold truncate max-w-full">{{ localEvent.summary }}</h3>
                    </div>
                    <div v-if="localIsEditing" class="flex flex-col gap-1">
                        <BaseInput type="datetime-local" v-model="localDate" placeholder="Fecha del evento" />
                        <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
                            {{ errorMessage }}
                        </p>
                    </div>
                    <div v-else class="flex flex-col">
                        <p class="text-sm">
                            <span class="font-semibold">Desde:</span>
                            {{ new Date(localEvent.start?.dateTime).toLocaleString("es-AR") }}
                        </p>
                        <p class="text-sm">
                            <span class="font-semibold">Hasta:</span>
                            {{ new Date(localEvent.end?.dateTime).toLocaleString("es-AR") }}
                        </p>
                    </div>
                    <div class="flex justify-end mt-4">
                        <BaseButton @click="closeModal" secondary>Cerrar</BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
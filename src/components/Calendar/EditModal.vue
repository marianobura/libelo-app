<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import { Clock, X } from 'lucide-vue-next';
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
    closeModal();
}

const handleDelete = () => {
    emit('delete')
    closeModal();
}

function formatDateTime(event) {
    if (event.start?.date || event.end?.date) {
        return { type: "allDay" };
    }

    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);

    const startTime = start.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const endTime = end.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    if (startTime === endTime) {
        return { type: "single", time: startTime };
    }

    return { type: "range", start: startTime, end: endTime };
}
</script>

<template>
    <BaseModal :show="props.show" class="items-center justify-center" @close="closeModal">
        <div class="bg-white rounded-xl max-w-md w-full mx-2 p-4 overflow-hidden">
            <div class="flex flex-col">
                <div class="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <p class="text-lg font-semibold">{{ localIsEditing ? 'Editar evento' : 'Información del evento' }}</p>
                    <button class="flex items-center justify-center bg-neutral-100 rounded-full p-2 text-neutral-600" @click="closeModal">
                        <X :size="16" :stroke-width="3" />
                    </button>
                </div>
                <div class="flex flex-col mt-2" :class="localIsEditing ? 'gap-2' : ''">
                    <template v-if="localIsEditing">
                        <BaseInput v-model="localEvent.summary" placeholder="Nombre del evento" />
                        <div class="flex flex-col gap-1">
                            <BaseInput type="datetime-local" v-model="localDate" placeholder="Fecha del evento" />
                            <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
                                {{ errorMessage }}
                            </p>
                        </div>
                    </template>
                    <template v-else>
                        <h3 class="text-lg font-semibold line-clamp-1 break-all">{{ localEvent.summary }}</h3>
                        <div class="flex gap-1 items-center">
                            <Clock size="16" />
                            <p v-if="formatDateTime(props.event).type === 'allDay'" class="text-sm">Durante todo el día</p>
                            <p v-else-if="formatDateTime(props.event).type === 'single'" class="text-sm">A las {{ formatDateTime(props.event).time }}hs</p>
                            <p v-else-if="formatDateTime(props.event).type === 'range'" class="text-sm">De {{ formatDateTime(props.event).start }}hs a {{ formatDateTime(props.event).end }}hs</p>
                        </div>
                    </template>
                </div>
                <div class="flex gap-2 mt-4">
                    <template v-if="localIsEditing">
                        <BaseButton @click="localIsEditing = false">Cancelar</BaseButton>
                        <BaseButton @click="handleSave" primary>Confirmar</BaseButton>
                    </template>
                    <template v-else>
                        <BaseButton @click="localIsEditing = true" primary>Editar</BaseButton>
                        <BaseButton @click="handleDelete" danger>Eliminar</BaseButton>
                    </template>
                </div>
            </div>
        </div>
    </BaseModal>
</template>
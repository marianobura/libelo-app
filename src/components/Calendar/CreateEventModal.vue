<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';

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
    // Copiar evento localmente
    localEvent.value = { ...props.event };
    localDate.value = props.date || '';
  }
});

const handleClose = () => emit('close');

const handleConfirm = () => {
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
    <div class="bg-white p-6 rounded-xl max-w-md w-full mx-2 max-h-[80vh] overflow-y-auto">
      <h2 class="text-lg font-bold mb-2">Crear Evento</h2>

      <div class="mb-2">
        <BaseInput v-model="localEvent.summary" placeholder="Nombre del evento" />
      </div>

      <div class="mb-2">
        <BaseInput type="datetime-local" v-model="localDate" />
      </div>

      <div class="flex justify-end mt-4 gap-2">
        <BaseButton @click="handleClose" secondary>Cancelar</BaseButton>
        <BaseButton @click="handleConfirm" primary>Crear</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseTitle from '../BaseTitle.vue';

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
        // Copiar evento localmente
        localEvent.value = { ...props.event };
        localDate.value = props.date || '';
    }
});

const handleClose = () => emit('close');

const handleConfirm = () => {
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
            <BaseTitle title="Crear un nuevo evento">
                <BaseInput v-model="localEvent.summary" placeholder="Nombre del evento" />
                <BaseInput type="datetime-local" v-model="localDate" />
                <div class="flex gap-2">
                    <BaseButton @click="handleClose" secondary>Cancelar</BaseButton>
                    <BaseButton @click="handleConfirm" primary>Crear</BaseButton>
                </div>
            </BaseTitle>
        </div>
    </BaseModal>
</template>
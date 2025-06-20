<!-- DeleteEventModal.vue -->
<script setup>
import { defineProps, defineEmits } from 'vue';
import BaseModal from '@/components/BaseModal.vue';
import BaseButton from '@/components/BaseButton.vue';

const props = defineProps({
  show: Boolean,
  event: Object
});

const emit = defineEmits(['close', 'confirm']);
const handleClose = () => emit('close');
const handleConfirm = () => emit('confirm');
</script>

<template>
  <BaseModal :show="props.show" class="items-center justify-center" @click.self="handleClose">
    <div class="bg-white p-6 rounded-xl max-w-md w-full mx-2 max-h-[80vh] overflow-y-auto">
      <h2 class="text-lg font-bold mb-2">¿Estás seguro de eliminar este evento?</h2>
      <p class="text-sm text-gray-600">Si lo eliminás, se borrará definitivamente.</p>
      <p class="text-sm text-gray-800 font-medium mt-2 whitespace-pre-wrap break-words">
        Evento: <span class="font-semibold">{{ props.event?.summary || 'Sin título' }}</span><br />
        Fecha:
        <span class="text-gray-700">
          {{ new Date(props.event?.start.dateTime).toLocaleString("es-AR") }} a
          {{ new Date(props.event?.end.dateTime).toLocaleString("es-AR") }}
        </span>
      </p>
      <div class="flex justify-end mt-4 gap-2">
        <BaseButton @click="handleClose" secondary>Cancelar</BaseButton>
        <BaseButton @click="handleConfirm" danger>Eliminar</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
<script setup>
import 'flowbite/dist/flowbite.min.js';
import 'flowbite-datepicker';
import { ref, defineEmits } from "vue";

const formattedDate = ref('');
const emit = defineEmits(['select-date']); // <--- Definí el evento

function formatDateInput(event) {
  let value = event.target.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);

  if (value.length >= 5) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
  } else if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  formattedDate.value = value;

  if (value.length === 10) {
    const [dd, mm, yyyy] = value.split('/');
    const date = new Date(+yyyy, +mm - 1, +dd);
    if (!isNaN(date)) {
      emit('select-date', date); // <--- Emití la fecha
    }
  }
}
</script>

<template>
    <div class="relative mt-3">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-libelo-600" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                        </svg>
                    </div>
                    <input id="custom-datepicker" type="text" v-model="formattedDate" @input="formatDateInput" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-libelo-500 focus:border-libelo-500 block w-full ps-10 p-2.5" placeholder="dd/mm/aaaa"/>
                </div>
</template>
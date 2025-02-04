<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { ref, computed } from "vue";

const options = ref([
  { id: 1, text: "Opción 1", selected: false },
  { id: 2, text: "Opción 2", selected: false },
  { id: 3, text: "Opción 3", selected: false },
  { id: 4, text: "Opción 4", selected: false },
  { id: 5, text: "Opción 5", selected: false },
]);

const showModal = ref(false);
const newOptionText = ref("");

const maxProgress = 100;
const checkpoints = computed(() => {
  return options.value.map((_, index) => (index + 1) * (maxProgress / options.value.length));
});

const progress = computed(() => {
  const selectedCount = options.value.filter(opt => opt.selected).length;
  return checkpoints.value[selectedCount - 1] || 0;
});

const addOption = () => {
  if (newOptionText.value.trim()) {
    options.value.push({
      id: options.value.length + 1,
      text: newOptionText.value.trim(),
      selected: false,
    });
    newOptionText.value = "";
    showModal.value = false;
  }
};
</script>

<template>
  <BaseBody>
    <BaseNav title="Materia" />
    <SubjectBanner />
    
    <div class="max-w-md mx-auto p-5">
      <div class="relative w-full h-6 rounded-lg border-2 border-blue-500 bg-white overflow-hidden" style="width: 300px;">
        <div class="h-full bg-blue-500 transition-all duration-300" :style="{ width: `${progress}%` }"></div>

        <div class="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2">
          <span 
            v-for="(point, index) in checkpoints"
            :key="index"
            class="w-3 h-3 rounded-full border-2 transition-all duration-300"
            :class="progress >= point ? 'bg-white border-white' : 'bg-blue-500 border-blue-500'"
            :style="{ left: `${point}%`, transform: 'translateX(-50%)' }"
            style="margin-left: 13px;"
          ></span>
        </div>
      </div>

      <p class="text-center mt-2 font-semibold">{{ progress }}%</p>

      <ul class="mt-4 space-y-2">
        <li
          v-for="option in options"
          :key="option.id"
          class="flex items-center gap-2 p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-200"
        >
          <input type="checkbox" v-model="option.selected" class="w-5 h-5 accent-blue-500 cursor-pointer" />
          <span>{{ option.text }}</span>
        </li>
      </ul>

      <div class="mt-4">
        <BaseButton @click="showModal = true" primary>Agregar objetivo</BaseButton>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-lg w-80">
          <h2 class="text-lg font-semibold mb-3">Agregar nueva opción</h2>
          <input 
            v-model="newOptionText" 
            type="text" 
            class="w-full p-2 border rounded-lg"
            placeholder="Escribe una opción..."
          />
          <div class="flex justify-end mt-3 gap-2">
            <BaseButton @click="showModal = false" secondary>Cancelar</BaseButton>
            <BaseButton @click="addOption" primary>Agregar</BaseButton>
          </div>
        </div>
      </div>

    </div>
  </BaseBody>
</template>

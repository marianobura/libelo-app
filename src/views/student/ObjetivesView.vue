<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const options = ref([]);
const showModal = ref(false);
const newOptionText = ref("");
const loading = ref(true);

const maxProgress = 100;
const checkpoints = computed(() => {
  return options.value.map((_, index) => (index + 1) * (maxProgress / options.value.length));
});

const progress = computed(() => {
  const selectedCount = options.value.filter(opt => opt.selected).length;
  return checkpoints.value[selectedCount - 1] || 0;
});

const fetchObjectives = async () => {
  try {
    const apiUrl = new URL(`/api/users/${userStore.user._id}/objectives`, process.env.VUE_APP_API_URL);
    const response = await axios.get(apiUrl.toString());
    options.value = response.data.data.map(item => ({
      text: item,
      selected: false
    }));
  } catch (error) {
    console.error("Error al obtener los objetivos:", error);
  } finally {
    loading.value = false;
  }
};


const addOption = async () => {
  if (newOptionText.value.trim()) {
    const newObjective = {
      text: newOptionText.value.trim(),
      selected: false,
    };

    try {
      const response = await axios.put(`/api/users/${userStore.user._id}/objectives`, newObjective);
      options.value.push(response.data);
    } catch (error) {
      console.error("Error al guardar el objetivo:", error);
    }

    newOptionText.value = "";
    showModal.value = false;
  }
};

onMounted(async () => {
  await userStore.fetchUser();
  await fetchObjectives();
});
</script>

<template>
  <BaseBody>
    <BaseNav title="Tus objetivos" />
    <SubjectBanner />
    
    <div class="max-w-md mx-auto p-5">
      <div v-if="loading" class="text-center font-semibold">Cargando...</div>
      
      <div v-else-if="options.length === 0" class="flex flex-col items-center justify-center gap-2 w-full bg-neutral-200 border border-neutral-300 font-semibold p-2 rounded-xl">
        <span>Todavía no tienes ningún objetivo.</span>
        <BaseButton @click="showModal = true" primary>Crea tus objetivos</BaseButton>
      </div>

      <div v-else>
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
            :key="option._id"
            class="flex items-center gap-2 p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-200"
          >
            <input type="checkbox" v-model="option.selected" class="w-5 h-5 accent-blue-500 cursor-pointer container-p" />
            <span>{{ option.text }}</span>
          </li>
        </ul>

        <div class="mt-4">
          <BaseButton @click="showModal = true" primary>Agregar objetivo</BaseButton>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-lg w-80">
          <h2 class="text-lg font-semibold mb-3">Agregar nuevo objetivo</h2>
          <input 
            v-model="newOptionText" 
            type="text" 
            class="w-full p-2 border rounded-lg"
            placeholder="Escribe un objetivo..."
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
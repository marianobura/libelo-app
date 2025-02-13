<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import SubjectBanner from "@/components/SubjectBanner.vue";
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/userStore";
import draggable from "vuedraggable";

const userStore = useUserStore();
const options = ref([]);
const showModal = ref(false);
const checkpointModal = ref(false);
const selectedCheckpointIndex = ref(null);
const newOptionText = ref("");
const loading = ref(true);

const maxProgress = 100;
const checkpoints = computed(() => {
  return options.value.map((_, index) => (index + 1) * (maxProgress / options.value.length));
});

const progress = computed(() => {
  const selectedCount = options.value.filter(opt => opt.selected).length;
  const progressPercentage = (selectedCount / options.value.length) * 100;
  return Math.round(progressPercentage);
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
  if (newOptionText.value.trim() === "") {
    return;
  }

  const newOption = newOptionText.value.trim();

  options.value.push({
    text: newOption,
    selected: false
  });

  newOptionText.value = "";
  showModal.value = false;

  try {
    const apiUrl = new URL(`/api/users/${userStore.user._id}/objectives`, process.env.VUE_APP_API_URL);
    const response = await axios.post(apiUrl.toString(), 
      { objectives: [newOption] },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Respuesta del servidor:", response.data);
  } catch (error) {
    console.error("Error al agregar el objetivo:", error);

    options.value.pop();

    if (error.response) {
      console.error("Detalles del error:", error.response.data);
    }
  }
};

const openCheckpointModal = (index) => {
  selectedCheckpointIndex.value = index;
  checkpointModal.value = true;
};

onMounted(async () => {
  await userStore.fetchUser();
  await fetchObjectives();
});

const updateObjectivesOrder = async (userId, newOrder) => {
  try {
    const apiUrl = new URL(`/api/users/${userId}/objectives/order`, process.env.VUE_APP_API_URL);
    const response = await axios.put(apiUrl.toString(), 
      { objectives: newOrder.map(option => option.text) },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Objetivos ordenados:', response.data);
  } catch (error) {
    console.error('Error al actualizar el orden de los objetivos', error);
  }
};
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
        <p class="text-center mb-2 font-semibold">Progreso actual: {{ progress.toFixed() }}%</p>
        <div class="relative w-full h-8 rounded-lg border-2 border-libelo-500 bg-white overflow-hidden">
          <div class="h-full bg-libelo-500 transition-all duration-300" :style="{ width: progress + '%' }">
        </div>
          <div class="absolute top-1/2 left-0 w-full h-8 flex transform -translate-y-1/2">
            <div v-for="(point, index) in checkpoints" :key="index" class="flex items-center justify-center h-full" :style="{ width: (maxProgress / options.length) + '%' }">
              <span 
                class="w-2 h-2 rounded-full transition-all duration-300" 
                :class="progress >= point ? 'bg-white border-white' : 'bg-libelo-500 border-libelo-500'" 
                @click="openCheckpointModal(index)"></span>
            </div>
          </div>
        </div>

        <draggable v-model="options" class="flex flex-col gap-2" tag="ul" @end="updateObjectivesOrder(userStore.user._id, options)">
          <template #item="{ element: objective }">
            <li class="flex items-center gap-2 p-2 border rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition duration-200">
              <input type="checkbox" v-model="objective.selected" class="w-5 h-5 accent-blue-500 cursor-pointer container-p" />
              <span>{{ objective.text }}</span>
              <button class="ml-20 bg-red-500 p-1 pr-2 pl-2">Borrar</button>
            </li>
          </template>
        </draggable>

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

      <!-- Modal para mostrar el contenido del checkpoint -->
      <div v-if="checkpointModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-5 rounded-lg shadow-lg w-80">
          <h2 class="text-lg font-semibold mb-3">Objetivo {{ selectedCheckpointIndex + 1 }}</h2>
          <p>{{ options[selectedCheckpointIndex]?.text }}</p>
          <div class="flex justify-end mt-3">
            <BaseButton @click="checkpointModal = false" secondary>Cerrar</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </BaseBody>
</template>

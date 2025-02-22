<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import axios from "axios";
import { ref, watch, onMounted } from "vue";

const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const promotions = ref([]);
const loading = ref(true);

const fetchPromotions = async () => {
  try {
    const apiUrl = new URL(`/api/promotions`, process.env.VUE_APP_API_URL);
    console.log('API URL:', apiUrl.toString()); // Verifica la URL que se está construyendo
    const response = await axios.get('/promotions.json');
    promotions.value = response.data.promotions; // Usar la estructura correcta
  } catch (error) {
    console.error("Error al obtener las promociones:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPromotions);

const currentSlide = ref(0);
const slider = ref(null);

const updateCurrentSlide = () => {
  const slideWidth = slider.value.scrollWidth / promotions.value.length;
  currentSlide.value = Math.round(slider.value.scrollLeft / slideWidth);
};

watch(slider, (sliderElement) => {
  if (sliderElement) {
    sliderElement.addEventListener("scroll", updateCurrentSlide);
  }
});
</script>

<template>
  <BaseBody>
    <BaseNav title="Puntos" />
    <div class="p-4">
      <!-- Puntos del usuario -->
      <div class="relative bg-gray-100 p-2 rounded mb-4">
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Tienes 15 puntos</span>
          <button @click="toggleDropdown" class="bg-gray-300 rounded px-2 py-1">
            ▼
          </button>
        </div>
        <!-- Dropdown -->
        <div v-if="isDropdownOpen" class="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded shadow-md">
          <ul class="py-2">
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <h2>Tiempo dedicado en la aplicación</h2>
              <p>5 horas.</p>
            </li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <h2>Alumnos con los que trabajaste</h2>
              <p>20 alumnos.</p>
            </li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <h2>Te solicitaron</h2>
              <p>4 alumnos.</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Trabajo y puntos -->
      <div class="mb-6">
        <h2 class="font-bold text-xl">Trabaja y gana puntos</h2>
        <p class="text-gray-600">Gana puntos trabajando y</p>
      </div>

      <!-- Promoción destacada -->
      <div class="bg-red-500 text-white p-4 rounded mb-6">
        <h2 class="font-bold text-lg mb-2">Promoción destacada</h2>
        <p class="text-sm mb-2">TE REGALAMOS 5$ EN TU PRIMER PEDIDO</p>
        <p class="text-sm font-bold">CÓDIGO: PY-8C51B4E</p>
      </div>

      <!-- Mostrar promociones por categoría -->
      <div class="p-4">
        <h2 class="font-bold text-lg mb-2">Lista de promociones</h2>
        
        <!-- Mostrar spinner si está cargando -->
        <div v-if="loading" class="text-center">Cargando promociones...</div>

        <!-- Contenedor de promociones -->
        <div v-if="!loading && promotions.length">
          <div v-for="category in promotions" :key="category.category" class="mb-6">
            <h3 class="font-bold text-lg mb-2">{{ category.category }}</h3>
            <div class="flex space-x-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x">
              <div v-for="(promotion, index) in category.promotions" :key="index" class="snap-center min-w-[70%] sm:min-w-[40%] md:min-w-[30%] lg:min-w-[20%] p-2 rounded text-center bg-gray-100 shadow-md">
                <p class="text-lg font-bold">{{ promotion.title }}</p>
                <p class="text-sm truncate">{{ promotion.description }}</p>
                <p class="text-sm">Ubicación: {{ promotion.location }}</p>
                <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
                <p class="text-sm font-bold">{{ promotion.terms }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mostrar mensaje si no hay promociones -->
        <div v-if="!loading && !promotions.length" class="text-center">No hay promociones disponibles.</div>
      </div>
    </div>
  </BaseBody>
</template>

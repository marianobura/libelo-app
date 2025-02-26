<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import axios from "axios";
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const userPoints = ref(0);
const route = useRoute();
const userId = ref(route.params.userId);
const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;  // Acceso correcto con .value
};

const promotions = ref([]);  // Usar .value al acceder o modificar
const loading = ref(true);

const fetchPromotions = async () => {
  try {
    const apiUrl = new URL(`/api/promotions`, process.env.VUE_APP_API_URL);
    console.log("API URL:", apiUrl.toString());
    const response = await axios.get("/promotions.json");
    promotions.value = response.data.promotions;  // Corregido con .value
  } catch (error) {
    console.error("Error al obtener las promociones:", error);
  } finally {
    loading.value = false;  // Corregido con .value
  }
};

const fetchUserPoints = async () => {
  try {
    const response = await axios.get(`/api/users/points/${userId.value}`);  // Corregido con .value
    userPoints.value = response.data.points;  // Corregido con .value
  } catch (error) {
    console.error("Error al obtener los puntos:", error);
  }
};

onMounted(fetchPromotions);
onMounted(fetchUserPoints);

const goToPromotion = (id, category) => {
  console.log("ID de la promoción seleccionada:", id, "Categoría:", category);
  router.push(`/teacher/points/${category}/${id}`);
};

const currentSlide = ref(0);
const slider = ref(null);

const updateCurrentSlide = () => {
  const slideWidth = slider.value.scrollWidth / promotions.value.length;  // Corregido con .value
  currentSlide.value = Math.round(slider.value.scrollLeft / slideWidth);  // Corregido con .value
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
      <div class="relative bg-gray-100 p-2 rounded mb-4">
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Tienes {{ userPoints.value }} puntos</span>
          <button @click="toggleDropdown" class="bg-gray-300 rounded px-2 py-1">▼</button>
        </div>

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

      <div class="mb-6">
        <h2 class="font-bold text-xl">Trabaja y gana puntos</h2>
        <p class="text-gray-600">Gana puntos trabajando y</p>
      </div>

      <div class="bg-red-500 text-white p-4 rounded mb-6">
        <h2 class="font-bold text-lg mb-2">Promoción destacada</h2>
        <p class="text-sm mb-2">TE REGALAMOS 5$ EN TU PRIMER PEDIDO</p>
        <p class="text-sm font-bold">CÓDIGO: PY-8C51B4E</p>
      </div>

      <div class="p-4">
        <h2 class="font-bold text-lg mb-2">Lista de promociones</h2>
        
        <div v-if="loading" class="text-center">Cargando promociones...</div>

        <div v-if="!loading && promotions.length">
          <div v-for="category in promotions" :key="category.category" class="mb-6">
            <h3 class="font-bold text-lg mb-2">{{ category.category }}</h3>
            <div class="flex space-x-1 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x">
              <div 
                v-for="(promotion, index) in category.promotions" 
                :key="index" 
                class="snap-center min-w-[70%] sm:min-w-[40%] md:min-w-[30%] lg:min-w-[20%] p-2 rounded text-center bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200"
                @click="goToPromotion(promotion.id, category.category)"
              >
              <img :src="promotion.image" alt="Imagen de promoción" class="w-full h-32 object-cover rounded">
                <h3 class="text-lg">{{ promotion.title }}</h3>
                <p class="text-sm font-bold">{{ promotion.description }}</p>
                <p class="text-sm">Ubicación: {{ promotion.location }}</p>
                <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
                <p class="text-sm">{{ promotion.terms }}</p>
                <p class="text-sm font-bold">Puntos {{ promotion.points }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loading && !promotions.length" class="text-center">No hay promociones disponibles.</div>
      </div>
    </div>
  </BaseBody>
</template>
<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import promotionsData from "@/assets/promotions.json";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const promotions = ref(promotionsData.promotions);
const router = useRouter();
const userPoints = computed(() => userStore.user?.points || 0);
const isDropdownOpen = ref(false);
const loading = ref(true);
const currentSlide = ref(0);
const slider = ref(null);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const fetchPromotions = async () => {
  if (!userStore.user?._id) return; 

  try {
    const apiUrl = `${process.env.VUE_APP_API_URL}/api/promotions?teacherId=${userStore.user._id}`;
    const response = await axios.get(apiUrl);
    promotions.value = response.data.data;
  } catch (error) {
    console.error("Error al obtener las promociones:", error);
  } finally {
    loading.value = false;
  }
};

const fetchUserPoints = async () => {
  if (!userStore.user?._id) return; 

  try {
    const apiUrl = `${process.env.VUE_APP_API_URL}/api/user/points/${userStore.user._id}`;
    const response = await axios.get(apiUrl);
    userStore.updatePoints(response.data.data);
  } catch (error) {
    console.error("Error al obtener los puntos:", error);
  }
};

onMounted(async () => {
  await userStore.fetchUser();
  if (userStore.user?._id) {
    await Promise.all([fetchUserPoints(), fetchPromotions()]);
  } else {
    console.error("No se pudo obtener el usuario antes de cargar promociones.");
  }
});

const goToPromotion = (id, category) => {
  router.push(`/teacher/points/${category}/${id}`);
};

const updateCurrentSlide = () => {
  if (!slider.value) return;
  const slideWidth = slider.value.scrollWidth / promotions.value.length;
  currentSlide.value = Math.round(slider.value.scrollLeft / slideWidth);
};

onMounted(() => {
  if (slider.value) {
    slider.value.addEventListener("scroll", updateCurrentSlide);
  }
});
</script>

<template>
  <BaseBody>
    <BaseNav title="Puntos" />
    <div class="p-4">
      <div class="relative bg-gray-100 p-2 rounded mb-4">
        <div class="flex items-center justify-between">
          <span class="text-lg font-semibold">Tienes {{ userPoints }} puntos</span>
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

        <div v-else>
          <div v-if="promotions.length">
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

          <div v-else class="text-center">No hay promociones disponibles.</div>
        </div>
      </div>
    </div>
  </BaseBody>
</template>

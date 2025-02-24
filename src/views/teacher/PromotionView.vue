<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const promotions = ref([]);
const loading = ref(true);
const route = useRoute();
const promotion = ref({});
const showModal = ref(false);
const userId = ref(route.params.userId); // Asegúrate de que esto esté correctamente asignado.
const userPoints = ref(0); // Asegúrate de que esta referencia esté declarada si necesitas usarla.

const fetchPromotions = async () => {
  try {
    const response = await axios.get("/promotions.json");
    promotions.value = response.data.promotions;
  } catch (error) {
    console.error("Error al obtener las promociones:", error);
  } finally {
    loading.value = false;
  }
};

const redeemPromotion = async () => {
  try {
    const response = await axios.post(`/api/users/redeem/${userId.value}/${promotion.value.points}`);
    if (response.data.remainingPoints >= 0) {
      alert("Canje exitoso, te quedan " + response.data.remainingPoints + " puntos.");
      userPoints.value = response.data.remainingPoints;
    } else {
      alert("No tienes suficientes puntos.");
    }
  } catch (error) {
    console.error("Error al canjear la promoción:", error);
  }
  openModal();
};


onMounted(async () => {
  await fetchPromotions();

  const category = promotions.value.find(cat => cat.category === route.params.category);

  if (category) {
    promotion.value = category.promotions.find(promo => promo.id == route.params.id) || {};
  } else {
    promotion.value = {};
  }

  console.log("Promoción encontrada:", promotion.value);
});
const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <BaseBody>
    <BaseNav :title="`Promoción - ${promotion.title || 'Cargando...'}`" />
    <div class="p-4">
      <div v-if="loading" class="text-center">Cargando promoción...</div>

      <div v-else-if="promotion.title">
        <img :src="promotion.image" alt="Promoción" class="w-full h-64 object-cover rounded mb-4">
        <h3 class="font-bold text-lg mb-2">{{ promotion.title }}</h3>
        <p class="text-sm">{{ promotion.description }}</p>
        <p class="text-sm">Ubicación: {{ promotion.location }}</p>
        <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
        <p class="text-sm font-bold">Términos: {{ promotion.terms }}</p>
        <p class="text-sm font-bold">Mis puntos: {{ promotion.points }}</p>
        <BaseButton @click="redeemPromotion" class="mt-4">{{ promotion.points }} Puntos</BaseButton>
      </div>

      <div v-else class="text-center">Promoción no encontrada.</div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-80">
        <h3 class="font-bold text-lg mb-2">Canjear promoción</h3>
        <p class="text-sm">¿Estás seguro de que deseas canjear esta promoción?</p>
        <div class="flex justify-end mt-4">
          <BaseButton @click="closeModal" class="mr-2">Cancelar</BaseButton>
          <BaseButton @click="closeModal" class="bg-red-500">Canjear</BaseButton>
        </div>
      </div>
    </div>
  </BaseBody>
</template>

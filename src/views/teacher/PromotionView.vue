<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const promotions = ref([]);
const loading = ref(true);
const route = useRoute();

const fetchPromotions = async () => {
  try {
    const response = await axios.get("/promotions.json");
    promotions.value = response.data.promotions.flatMap(cat => cat.promotions);
  } catch (error) {
    console.error("Error al obtener las promociones:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPromotions);

// Obtener la promoción actual según el parámetro de la URL
const promotion = computed(() => {
  return promotions.value.find(promo => promo.path === route.params.path) || {};
});
</script>

<template>
  <BaseBody>
    <BaseNav :title="`Promoción - ${promotion.title || 'Cargando...'}`" />
    <div class="p-4">
      <div v-if="loading" class="text-center">Cargando promoción...</div>

      <div v-else-if="promotion.title">
        <h3 class="font-bold text-lg mb-2">{{ promotion.title }}</h3>
        <p class="text-sm">{{ promotion.description }}</p>
        <p class="text-sm">Ubicación: {{ promotion.location }}</p>
        <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
        <p class="text-sm font-bold">Términos: {{ promotion.terms }}</p>
        <p class="text-sm font-bold">Puntos: {{ promotion.points }}</p>
      </div>

      <div v-else class="text-center">Promoción no encontrada.</div>
    </div>
  </BaseBody>
</template>

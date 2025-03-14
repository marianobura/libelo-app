<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import promotionsData from "@/assets/promotions.json";
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const promotions = ref(promotionsData.promotions);
const route = useRoute();
const promotion = ref({});
const showModal = ref(false);
const userStore = useUserStore();
const userId = computed(() => userStore.user?._id);
const userPoints = computed(() => userStore.user?.points);
const codeVisible = ref(false);
const errors = ref({
    promo: ''
});

const categoryName = computed(() => {
  if (!promotions.value.length) return "Cargando...";
  const category = promotions.value.find(
    (cat) => cat.category === route.params.category
  );
  return category ? category.category : "No encontrado";
});

const redeemPromotion = async () => {
  // Asegúrate de que userId es obtenido correctamente
  const id = userId.value; // Aquí se obtiene el userId correctamente
  if (!id) {
    errors.value.promo = 'No se ha encontrado el usuario.';
    return;
  }

  if (userPoints.value < promotion.value.points) {
    errors.value.promo = 'No tienes suficientes puntos para canjear esta promoción.';
    return;
  }

  if (promotion.value.redeemed) {
    errors.value.promo = 'Ya has canjeado esta promoción.';
    return;
  }

  try {
    const newPoints = userPoints.value - promotion.value.points;
    const apiUrl = new URL(`/api/users/${userId.value}/redeem`, process.env.VUE_APP_API_URL);

    const response = await axios.put(apiUrl.toString(), {
      promotionId: promotion.value.id,
      promotionCode: promotion.value.code,
      redeemedPoints: promotion.value.points,
      newPoints
    });

    if (response.status === 200) {
      userStore.user.points = newPoints;
      codeVisible.value = true;
      promotion.value.redeemed = true;
    } else {
      errors.value.promo = 'Hubo un problema al canjear la promoción.';
    }
  } catch (error) {
    console.error("Error al canjear la promoción:", error);
  }

  openModal();
};


onMounted(async () => {
  const category = promotions.value.find(
    (cat) => cat.category === route.params.category
  );

  if (category) {
    promotion.value = category.promotions.find((promo) => promo.id == route.params.id) || {};
  } else {
    promotion.value = {};
  }
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
    <BaseNav :title="`Promoción - ${categoryName}`" />
    <div class="p-4">
      <div v-if="!promotion.title" class="text-center">Promoción no encontrada.</div>
      <div v-else>
        <img :src="promotion.image" alt="Promoción" class="w-full h-auto object-cover rounded mb-4">
        <h3 class="font-bold text-lg mb-2">{{ promotion.title }}</h3>
        <p class="text-sm">{{ promotion.description }}</p>
        <p class="text-sm">Ubicación: {{ promotion.location }}</p>
        <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
        <p class="text-sm font-bold">Términos: {{ promotion.terms }}</p>
        <p class="text-sm font-bold">Mis puntos: {{ userPoints }}</p>

        <BaseButton @click="openModal" class="mt-4">
          Canjear ({{ promotion.points }} Puntos)
        </BaseButton>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-lg w-80">
        <h3 class="font-bold text-lg mb-2">Canjear promoción</h3>
        <p class="text-sm">¿Estás seguro de que deseas canjear esta promoción?</p>
        <p v-if="errors.promo" class="text-red-500 text-sm">{{ errors.promo }}</p>
        <div>
          <textarea v-if="codeVisible" v-model="promotion.code" class="w-full h-11 p-2 border rounded-md" placeholder="Código"></textarea>
        </div>
        <div class="flex justify-end mt-4">
          <BaseButton @click="closeModal" class="mr-2 text-red-500">Cancelar</BaseButton>
          <BaseButton @click="redeemPromotion" class="bg-blue-500 text-white">Canjear</BaseButton>
        </div>
      </div>
    </div>
  </BaseBody>
</template>
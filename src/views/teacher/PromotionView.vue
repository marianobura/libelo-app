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
const loading = ref(true);
const route = useRoute();
const promotion = ref({});
const showModal = ref(false);
const userStore = useUserStore();
const userId = ref(userStore.user?._id);
const userPoints = computed(() => userStore.user?.points);
const codeVisible = ref(false);
const errors = ref({
    promo: ''
});

const categoryName = computed(() => {
  const category = promotions.value.find(
    (cat) => cat.category === route.params.category
  );
  return category ? category.category : "Cargando...";
});

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
  if (!userId.value) {
    console.error("User ID no disponible.");
    return;
  }

  try {
    const apiUrl = `${process.env.VUE_APP_API_URL}/api/users/${userId.value}`;
    const response = await axios.get(apiUrl.toString());
    
    if (response.data && response.data.points !== undefined) {
      userPoints.value = response.data.points;
    } else {
      console.error("Error: La respuesta del servidor no contiene puntos.");
    }
  } catch (error) {
    console.error("Error al obtener los puntos del usuario:",error);
}
};

const redeemPromotion = async () => {
  if (userPoints.value < promotion.value.points) {
    errors.value.promo = 'No tienes suficientes puntos para canjear esta promoción.';
    console.error("No tienes suficientes puntos.");
    return;
  }

  if (promotion.value.redeemed) {
    errors.value.promo = 'Ya has canjeado esta promoción.';
    console.error("La promoción ya ha sido canjeada.");
    return;
  }

  try {
    const newPoints = userPoints.value - promotion.value.points;
    const apiUrl = `${process.env.VUE_APP_API_URL}/api/users/${userId.value}/redeem`;

    const response = await axios.put(apiUrl, {
      promotionId: promotion.value.id,
      promotionCode: promotion.value.code,
      newPoints
    });

    if (response.status === 200) {
      userStore.user.points = newPoints;
      codeVisible.value = true;
      promotion.value.redeemed = true;
      console.log("¡Promoción canjeada con éxito!");
    } else {
      errors.value.promo = 'Hubo un problema al canjear la promoción.';
      console.log("Hubo un problema al canjear la promoción.");
    }
  } catch (error) {
    console.error("Error al canjear la promoción:", error);
  }

  openModal();
};

onMounted(async () => {
  await fetchUserPoints();
  await fetchPromotions();

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
      <div v-if="loading" class="text-center">Cargando promoción...</div>

      <div v-else-if="promotion.title">
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

      <div v-else class="text-center">Promoción no encontrada.</div>
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
<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import promotionsData from "@/assets/promotions.json";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

const promotions = ref(promotionsData.promotions);
const route = useRoute();
const promotion = ref({});
const showModal = ref(false);
const userStore = useUserStore();
const userPoints = computed(() => userStore.user?.points);
const errors = ref({ promo: "" });

onMounted(() => {
    const promotionId = route.params.id;
    promotion.value = promotions.value.map(category => category.promotions).flat().find(promo => promo.id === promotionId);
});

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
    errors.value.promo = "";
};

const redeemPromotion = async () => {
    if (!promotion.value.id) {
        errors.value.promo = "Promoción no válida.";
        return;
    }

    if (userPoints.value < promotion.value.points) {
        errors.value.promo = "No tienes suficientes puntos.";
        return;
    }

    try {
        const apiUrl = new URL(`/api/users/${userStore.user._id}/redeem-promotion`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl, {
            promotionId: promotion.value.id,
            promotionCode: promotion.value.code || "SIN-CÓDIGO",
            newPoints: userPoints.value - promotion.value.points,
        });

        const data = response.data;

        userStore.user.points = data.user.points;
        userStore.user.promotions.push({
            id: promotion.value.id,
            promotion_code: promotion.value.code || "SIN-CÓDIGO",
            redeemed: true,
        });

        closeModal();
        alert("¡Promoción canjeada con éxito!");
    } catch (error) {
        errors.value.promo = error.response?.data?.msg || "Error al canjear la promoción.";
    }
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Promoción" />
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

                <BaseButton @click="openModal" class="mt-4" primary>
                    Canjear ({{ promotion.points }} Puntos)
                </BaseButton>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-4 rounded shadow-lg w-80">
                <h3 class="font-bold text-lg mb-2">Canjear promoción</h3>
                <p class="text-sm">¿Estás seguro de que deseas canjear esta promoción?</p>
                <p v-if="errors.promo" class="text-red-500 text-sm">{{ errors.promo }}</p>
                <div class="flex justify-end mt-4 gap-2">
                    <BaseButton @click="closeModal" danger>Cancelar</BaseButton>
                    <BaseButton @click="redeemPromotion" primary>Canjear</BaseButton>
                </div>
            </div>
        </div>
    </BaseBody>
</template>
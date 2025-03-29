<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import BaseButton from "@/components/BaseButton.vue";
import promotionsData from "@/assets/promotions.json";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { Coins, Info, MapPin, TicketCheck } from "lucide-vue-next";

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
            <div v-else class="flex flex-col justify-between h-full gap-4">
                <div>
                    <img :src="promotion.image" alt="Promoción" class="w-full h-56 object-cover rounded">
                    <div class="flex flex-col py-2 border-b border-neutral-300">
                        <div class="flex justify-between items-center">
                            <h3 class="font-bold overflow-hidden text-ellipsis line-clamp-1">{{ promotion.title }}</h3>
                            <div class="flex gap-1 items-center bg-libelo-500/10 text-libelo-500 px-2 rounded">
                                <Coins size="16" />
                                <span class="font-semibold">{{ promotion.points }}</span>
                            </div>
                        </div>
                        <p v-if="promotion.name !== 'Genérica'" class="text-sm">Promoción por <span class="font-semibold">{{ promotion.name }}</span></p>
                    </div>
                    <div class="mt-2 flex flex-col gap-2">
                        <p class="font-semibold">{{ promotion.description }}</p>
                        <div class="flex gap-2 items-center">
                            <div class="p-1 rounded text-libelo-500 bg-libelo-500/10 mb-auto">
                                <MapPin size="20" />
                            </div>
                            <p>{{ promotion.location }}</p>
                        </div>
                        <div class="flex gap-2 items-center">
                            <div class="p-1 rounded text-libelo-500 bg-libelo-500/10 mb-auto">
                                <TicketCheck size="20" />
                            </div>
                            <p>Válido hasta {{ promotion.valid_until }}</p>
                        </div>
                        <div class="flex gap-2 items-center">
                            <div class="p-1 rounded text-libelo-500 bg-libelo-500/10 mb-auto">
                                <Info size="20" />
                            </div>
                            <p>{{ promotion.terms }}</p>
                        </div>
                    </div>
                </div>
                <BaseButton v-if="userPoints >= promotion.points" @click="openModal" primary>Canjear por {{ promotion.points }} puntos</BaseButton>
                <BaseButton v-else danger>No tienes puntos suficientes</BaseButton>
            </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-4 rounded shadow-lg w-80">
                <h3 class="font-bold text-lg mb-2">Canjear promoción</h3>
                <p>¿Estás seguro de que deseas canjear esta promoción?</p>
                <p v-if="errors.promo" class="text-red-500 text-sm">{{ errors.promo }}</p>
                <div class="flex justify-end mt-4 gap-2">
                    <BaseButton @click="closeModal" danger>Cancelar</BaseButton>
                    <BaseButton @click="redeemPromotion" primary>Canjear</BaseButton>
                </div>
            </div>
        </div>
    </BaseBody>
</template>
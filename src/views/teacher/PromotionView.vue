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
import RedeemModal from "@/components/Promotions/RedeemModal.vue";
import { watch } from "vue";
import LibeloIsologo from "@/assets/LibeloIsologo.vue";

const promotions = ref(promotionsData.promotions);
const route = useRoute();
const promotion = ref({});
const showModal = ref(false);
const userStore = useUserStore();
const userPoints = computed(() => userStore.user?.points);
const errors = ref({ promo: "" });
const imageFailed = ref(false);

watch(() => promotion.value.image, () => {
    imageFailed.value = false;
});

const handleImageError = () => {
    imageFailed.value = true;
};

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

function generateRandomCode(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

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
        const promotionCode = generateRandomCode();
        const apiUrl = new URL(`/api/users/${userStore.user._id}/redeem-promotion`, process.env.VUE_APP_API_URL);
        const response = await axios.put(apiUrl, {
            promotionId: promotion.value.id,
            promotionCode: promotionCode,
            newPoints: userPoints.value - promotion.value.points,
        });

        const data = response.data;

        userStore.user.points = data.user.points;
        userStore.user.promotions.push({
            id: promotion.value.id,
            code: promotionCode,
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
        <div class="p-2">
            <div class="flex flex-col justify-between h-full gap-4">
                <div class="flex flex-col">
                    <img v-if="promotion.image && !imageFailed" :src="promotion.image" alt="Promoción" class="w-full h-56 object-cover rounded-xl" @error="handleImageError">
                    <div v-else class="w-full h-56 flex items-center justify-center bg-libelo-500 rounded-xl">
                        <LibeloIsologo class="w-32 h-auto text-white" />
                    </div>
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

        <RedeemModal :show-modal="showModal" :promotion="promotion" :user-points="userPoints" :error="errors.promo" @close="closeModal" @redeem="redeemPromotion" />
    </BaseBody>
</template>
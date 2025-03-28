<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import ProductCard from "@/components/Promotions/PromotionCard.vue";
import promotionsData from "@/assets/promotions.json";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { Coins } from "lucide-vue-next";

const userStore = useUserStore();
const loading = ref(false);
const promotions = ref(promotionsData.promotions);

const getRandomPromotions = (promotions, category) => {
    return promotions
        .map((promotion) => ({ ...promotion, category }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
};

const allHighlightedPromotions = computed(() => {
    return promotions.value.flatMap(category =>
        getRandomPromotions(category.promotions, category.category)
    );
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Puntos" />
        <div class="p-4">
            <div class="flex gap-2 items-center justify-center border-2 border-libelo-500 text-libelo-500 bg-libelo-500/5 rounded-xl h-12 mb-4">
                <Coins size="20" stroke-width="2" />
                <span class="font-semibold">Tienes {{ userStore.user.points }} puntos</span>
            </div>
            <div class="rounded-xl overflow-hidden">
                <img src="/img/pedidosYa.jpg" alt="Imagen de promoción de PedidosYa" width="100%">
                <!-- <h2 class="font-bold text-lg mb-2">Promoción destacada</h2>
                <p class="text-sm mb-2">TE REGALAMOS 5$ EN TU PRIMER PEDIDO</p>
                <p class="text-sm font-bold">CÓDIGO: PY-8C51B4E</p> -->
            </div>
        </div>

        <div class="overflow-hidden">
            <div class="mt-2">
                <div class="border-b-2 border-black mb-2 mx-4">
                    <h2 class="font-bold text-lg w-full">Promociones destacadas</h2>
                </div>
                <div v-if="loading" class="text-center">Cargando promociones...</div>
                <div v-else-if="allHighlightedPromotions.length && !loading" class="overflow-hidden w-full">
                    <div class="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x flex gap-2 px-4" ref="slider">
                        <ProductCard v-for="(promotion, index) in allHighlightedPromotions" :key="index" :promotion="promotion" />
                    </div>
                </div>
                <div v-else class="text-center">No hay promociones destacadas disponibles.</div>
            </div>
            <div class="mt-8">
                <div class="border-b-2 border-black mb-2 mx-4">
                    <h2 class="font-bold text-lg w-full">Lista de promociones</h2>
                </div>
                <div v-if="loading" class="text-center">Cargando promociones...</div>
                <div v-else-if="promotions.length && !loading" class="overflow-hidden w-full">
                    <div v-for="category in promotions" :key="category.category" class="mb-6">
                        <h3 class="font-semibold mb-2 px-4 uppercase">{{ category.category }}</h3>
                        <div class="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x flex gap-2 px-4" ref="slider">
                            <ProductCard v-for="(promotion, index) in category.promotions" :key="index" :promotion="promotion" />
                        </div>
                    </div>
                </div>
                <div v-else class="text-center">No hay promociones disponibles.</div>
            </div>
        </div>
    </BaseBody>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
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
const selectedCategory = ref(null);

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

const filteredPromotions = computed(() => {
    if (!selectedCategory.value) return [];
    const category = promotions.value.find(p => p.category === selectedCategory.value);
    return category ? category.promotions : [];
});

if (promotions.value.length > 0 && !selectedCategory.value) {
    selectedCategory.value = promotions.value[0].category;
}

const selectCategory = (categoryName) => {
    selectedCategory.value = categoryName;
};
</script>

<template>
    <BaseBody>
        <BaseNav title="Promociones" />
        <div class="p-2">
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
                <div class="border-b-2 border-black mb-4 mx-2">
                    <h2 class="font-bold text-lg w-full">Promociones destacadas</h2>
                </div>
                <div v-if="loading" class="text-center">Cargando promociones...</div>
                <div v-else-if="allHighlightedPromotions.length && !loading" class="overflow-hidden w-full">
                    <div class="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth flex gap-2 px-2" ref="slider">
                        <ProductCard detailed v-for="(promotion, index) in allHighlightedPromotions" :key="index" :promotion="promotion" />
                    </div>
                </div>
            </div>
            <div v-if="promotions.length > 0" :class="allHighlightedPromotions.length === 0 ? 'mt-2' : 'mt-8'">
                <div class="border-b-2 border-black mb-4 mx-2">
                    <h2 class="font-bold text-lg w-full">Todas las promociones</h2>
                </div>
                <div v-if="loading" class="text-center">Cargando promociones...</div>
                <div v-else-if="promotions.length && !loading" class="overflow-hidden mb-4">
                    <div class="flex gap-2 overflow-x-auto no-scrollbar px-2" ref="slider">
                        <button v-for="category in promotions" @click="selectCategory(category.category)" :key="category.category"
                        :class="[ 'px-4 py-2 border rounded-xl font-semibold', selectedCategory === category.category ? 'bg-libelo-100 text-libelo-500 border-libelo-100' : 'bg-white text-black hover:bg-neutral-300']">{{ category.category }}</button>
                    </div>
                    <div v-if="selectedCategory" class="mt-4">
                        <div class="flex flex-col gap-2 px-2" ref="slider">
                            <ProductCard compact v-for="(promotion, index) in filteredPromotions" :key="index" :promotion="promotion" />
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
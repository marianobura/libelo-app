<script setup>
import BaseBody from "@/components/BaseBody.vue";
import BaseNav from "@/components/BaseNav.vue";
import promotionsData from "@/assets/promotions.json";
import pedidosYaImage from "@/assets/promos/pedidosYa.jpg";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const router = useRouter();
const isDropdownOpen = ref(false);
const loading = ref(false);
const slider = ref(null);
const promotions = ref(promotionsData.promotions);

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
};

const goToPromotion = (id, category) => {
    router.push(`/teacher/points/${category}/${id}`);
};

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
            <div class="relative bg-gray-100 p-2 rounded mb-4">
                <div class="flex items-center justify-between">
                    <span class="text-lg font-semibold">Tienes {{ userStore.user.points }} puntos</span>
                    <button @click="toggleDropdown" class="bg-gray-300 rounded px-2 py-1">▼</button>
                </div>

                <div v-if="isDropdownOpen"
                    class="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded shadow-md">
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
                <p class="text-gray-600">¡Gana puntos trabajando y canjealos en lo que quieras!</p>
            </div>
        </div>

        <div class="text-white pt-20 pb-8 rounded bg-container bg-no-repeat"
            :style="{ backgroundImage: `url(${pedidosYaImage})` }">
            <h2 class="font-bold text-lg mb-2">Promoción destacada</h2>
            <p class="text-sm mb-2">TE REGALAMOS 5$ EN TU PRIMER PEDIDO</p>
            <p class="text-sm font-bold">CÓDIGO: PY-8C51B4E</p>
        </div>

        <div class="p-4">
            <div>
                <h2 class="font-bold text-lg mb-2">Promociones destacadas</h2>

                <div v-if="loading" class="text-center">Cargando promociones...</div>

                <div v-else>
                    <div v-if="allHighlightedPromotions.length">
                        <div class="overflow-hidden w-full">
                            <div class="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x flex space-x-3 py-2 px-4"
                                ref="slider">
                                <div v-for="(promotion, index) in allHighlightedPromotions" :key="index"
                                    class="snap-center flex-none w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 rounded text-center bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200"
                                    @click="goToPromotion(promotion.id, promotion.category)">
                                    <img :src="promotion.image" alt="Imagen de promoción"
                                        class="w-full h-40 object-cover rounded">
                                    <p class="text-sm font-bold">{{ promotion.category }}</p>
                                    <h3 class="text-lg mt-2">{{ promotion.title }}</h3>
                                    <p class="text-sm font-bold">{{ promotion.description }}</p>
                                    <p class="text-sm">Ubicación: {{ promotion.location }}</p>
                                    <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
                                    <p class="text-sm">{{ promotion.terms }}</p>
                                    <p class="text-sm font-bold">Puntos {{ promotion.points }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center">No hay promociones destacadas disponibles.</div>
                </div>
            </div>

            <div class="p-4 mt-20">
                <h2 class="font-bold text-lg mb-2">Lista de promociones</h2>

                <div v-if="loading" class="text-center">Cargando promociones...</div>

                <div v-else>
                    <div v-if="promotions.length">
                        <div v-for="category in promotions" :key="category.category" class="mb-6">
                            <h3 class="font-bold text-lg mb-2">{{ category.category }}</h3>
                            <div class="overflow-hidden w-full">
                                <div class="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth touch-pan-x flex space-x-3 py-2 px-4"
                                    ref="slider">
                                    <div v-for="(promotion, index) in category.promotions" :key="index"
                                        class="snap-center flex-none w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 rounded text-center bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200"
                                        @click="goToPromotion(promotion.id, category.category)">
                                        <img :src="promotion.image" alt="Imagen de promoción"
                                            class="w-full h-40 object-cover rounded">
                                        <h3 class="text-lg mt-2">{{ promotion.title }}</h3>
                                        <p class="text-sm font-bold">{{ promotion.description }}</p>
                                        <p class="text-sm">Ubicación: {{ promotion.location }}</p>
                                        <p class="text-sm">Válido hasta: {{ promotion.valid_until }}</p>
                                        <p class="text-sm">{{ promotion.terms }}</p>
                                        <p class="text-sm font-bold">Puntos {{ promotion.points }}</p>
                                    </div>
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
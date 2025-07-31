<script setup>
import { ref, onMounted } from 'vue';
import BaseBody from '@/components/BaseBody.vue';
import BaseNav from '@/components/BaseNav.vue';
import EmptyState from '@/components/EmptyState.vue';
import { goTo } from '@/router';
import { useUserStore } from '@/stores/userStore';
import promotionsData from '@/assets/promotions.json';
import BaseTitle from '@/components/BaseTitle.vue';
import { TicketCheck } from 'lucide-vue-next';
import LibeloIsologo from '@/assets/LibeloIsologo.vue';

const userStore = useUserStore();
const promotions = ref(promotionsData.promotions);
const enrichedPromotions = ref([]);
const failedImages = ref(new Set());

const findPromotionById = (id) => {
    for (const category of promotions.value) {
        const promo = category.promotions.find((p) => p.id === id);
        if (promo) return promo;
    }
    return null;
};

const handleImageError = (id) => {
    failedImages.value.add(id);
};

onMounted(() => {
    enrichedPromotions.value = userStore.user.promotions.map((redeemed) => {
        const fullPromo = findPromotionById(redeemed.id);

        return {
            ...redeemed,
            title: fullPromo.title,
            image: fullPromo.image,
        };
    });
});
</script>

<template>
    <BaseBody>
        <BaseNav title="Mis promociones" />
        <div class="p-2">
            <BaseTitle v-if="enrichedPromotions.length > 0" title="Promociones canjeadas" description="Estas son todas las promociones que has canjeado. Revisa los detalles y disfruta tus beneficios.">
                <div class="flex flex-col-reverse gap-2">
                    <div v-for="promotion in enrichedPromotions" :key="promotion.id" class="bg-white rounded-xl flex items-center overflow-hidden" @click="goTo(`/teacher/promotions/${promotion.id}`)">
                        <div class="size-20 shrink-0 overflow-hidden">
                            <img v-if="promotion.image && !failedImages.has(promotion.id)" :src="promotion.image" alt="Imagen de la promoción" class="w-full h-full object-cover" @error="handleImageError(promotion.id)" />
                            <div v-else class="p-2 bg-libelo-500 flex items-center justify-center h-full w-full">
                                <LibeloIsologo class="w-12 h-auto text-white" />
                            </div>
                        </div>
                        <div class="px-2 flex flex-col grow">
                            <span class="font-semibold line-clamp-1 break-all border-b border-neutral-200 pb-1 mb-1">{{ promotion.title }}</span>
                            <div class="flex gap-2 text-sm mt-1">Código de canjeo:<span class="px-2 py-0.5 bg-libelo-50 text-libelo-500 font-semibold rounded-xl tracking-wider">{{ promotion.code }}</span></div>
                        </div>
                    </div>
                </div>
            </BaseTitle>
            <div v-else class="h-full flex items-center">
                <EmptyState title="No tienes promociones" :icon="TicketCheck">Aún no has canjeado ninguna promoción. ¡Explora las disponibles y canjea la que más te guste!</EmptyState>
            </div>
        </div>
    </BaseBody>
</template>
<script setup>
import { MapPin, TicketCheck, Info, Coins } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { defineProps } from "vue";

const props = defineProps({
    promotion: {
        type: Object,
        required: true,
    }
});

const router = useRouter();

const goToPromotion = () => {
    router.push(`/teacher/promotions/${props.promotion.id}`);
};
</script>

<template>
    <div :class="props.promotion.category ? 'relative' : ''" class="snap-center flex-none w-11/12 p-2 rounded border border-neutral-300 cursor-pointer hover:bg-gray-200"
        @click="goToPromotion">
        <img :src="props.promotion.image" alt="Imagen de promoción" class="w-full h-40 object-cover rounded">
        <p v-if="props.promotion.category" class="absolute top-0 mt-2 bg-body px-2 pb-0.5 rounded-br-md text-sm font-bold text-libelo-500">{{ props.promotion.category }}</p>
        <div class="flex flex-col">
            <div class="flex flex-col py-2 border-b border-neutral-300">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold overflow-hidden text-ellipsis line-clamp-1">{{ props.promotion.title }}</h3>
                    <div class="flex gap-1 items-center bg-libelo-500/10 text-libelo-500 px-2 rounded">
                        <Coins size="16" />
                        <span class="font-semibold">{{ props.promotion.points }}</span>
                    </div>
                </div>
                <p v-if="props.promotion.name !== 'Genérica'" class="text-sm">Promoción por <span class="font-semibold">{{ props.promotion.name }}</span></p>
            </div>
            <div class="mt-2 flex flex-col gap-2">
                <p class="font-semibold">{{ props.promotion.description }}</p>
                <div class="flex gap-2 items-center">
                    <div class="p-1 rounded text-libelo-500 bg-libelo-500/10 mb-auto">
                        <MapPin size="20" />
                    </div>
                    <p>{{ props.promotion.location }}</p>
                </div>
                <div class="flex gap-2 items-center">
                    <div class="p-1 rounded text-libelo-500 bg-libelo-500/10 mb-auto">
                        <TicketCheck size="20" />
                    </div>
                    <p>Válido hasta {{ props.promotion.valid_until }}</p>
                </div>
                <div class="flex gap-2 items-center">
                    <div class="p-1 rounded text-libelo-500 bg-libelo-500/10 mb-auto">
                        <Info size="20" />
                    </div>
                    <p>{{ props.promotion.terms }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
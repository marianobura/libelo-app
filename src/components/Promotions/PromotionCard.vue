<script setup>
/* eslint-disable */
import { MapPin, TicketCheck, Info, Coins, ArrowUpRight } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { defineProps, watch } from "vue";
import { ref } from "vue";

const props = defineProps({
    promotion: {
        type: Object,
        required: true,
    },
    detailed: {
        type: Boolean,
        default: false,
    },
    compact: {
        type: Boolean,
        default: false,
    }
});

const router = useRouter();
const imageFailed = ref(false);

watch(() => props.promotion.image, () => {
    imageFailed.value = false;
});

const handleImageError = () => {
    imageFailed.value = true;
};

const goToPromotion = () => {
    router.push(`/teacher/promotions/${props.promotion.id}`);
};
</script>

<template>
    <div v-if="detailed" :class="props.promotion.category ? 'relative' : ''" class="bg-white snap-center flex-none w-11/12 rounded-xl border border-neutral-300 cursor-pointer overflow-hidden hover:bg-neutral-100" @click="goToPromotion">
        <img v-if="props.promotion.image && !imageFailed" :src="props.promotion.image" alt="Imagen de promoción" class="w-full h-40 object-cover" @error="handleImageError">
        <div v-else class="w-full h-40 flex items-center justify-center bg-libelo-500">
            <img src="/logo.svg" alt="Logo de Libelo" class="w-32 h-auto">
        </div>
        <p v-if="props.promotion.category" class="absolute top-0 bg-white px-2 py-1 pb-0.5 rounded-br-md text-sm font-semibold text-libelo-500">{{ props.promotion.category }}</p>
        <div class="flex flex-col p-2">
            <div class="flex flex-col py-2 border-b border-neutral-300">
                <div class="flex justify-between items-center">
                    <h3 class="font-bold overflow-hidden text-ellipsis line-clamp-1">{{ props.promotion.title }}</h3>
                    <div class="flex gap-1 items-center bg-libelo-500/10 text-libelo-500 px-2 rounded">
                        <Coins size="16" />
                        <span class="font-semibold">{{ props.promotion.points }}</span>
                    </div>
                </div>
                <p v-if="props.promotion.name" class="text-sm">Promoción por <span class="font-semibold">{{ props.promotion.name }}</span></p>
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

    <div v-if="compact" class="grid grid-cols-[auto_1fr] items-center bg-white w-full rounded-xl border border-neutral-300 cursor-pointer overflow-hidden hover:bg-neutral-100" @click="goToPromotion">
        <div class="size-24 overflow-hidden" :class="imageFailed ? 'bg-libelo-500 flex items-center justify-center' : ''">
            <img v-if="props.promotion.image && !imageFailed" :src="props.promotion.image" alt="Imagen de promoción" class="size-24 h-full object-cover" @error="handleImageError">
            <img v-else src="/logo.svg" alt="Logo de Libelo" class="w-16 h-auto">
        </div>
        <div class="flex flex-col p-2">
            <div class="flex justify-between items-center border-b border-neutral-300 mb-1 pb-1">
                <h3 class="font-semibold overflow-hidden text-ellipsis line-clamp-1">{{ props.promotion.name }}</h3>
                <ArrowUpRight :size="20" class="text-libelo-500" />
            </div>
            <p class="text-sm line-clamp-2 break-normal">{{ props.promotion.description }}</p>
        </div>
    </div>
</template>